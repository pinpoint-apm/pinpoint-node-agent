/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('../../lib/agent-builder')
const { ConfigBuilder } = require('../../lib/config-builder')
const TraceContextBuilder = require('../../lib/context/trace-context-builder')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const { UriStatsConfigBuilder } = require('../../lib/metric/uri/uri-stats-config-builder')
const { UriStatsSpanRecorderFactory } = require('../../lib/metric/uri/uri-stats-span-recorder-factory')
const { UriStatsRepositoryBuilder } = require('../../lib/metric/uri/uri-stats-repository')
const { TraceCompletionEnricher } = require('../../lib/metric/uri/trace-completion-enricher')
const { SqlStatsConfigBuilder } = require('../../lib/metric/sql/sql-stats-config-builder')
const { UidParsingResultFactory } = require('../../lib/metric/sql/uid-parsing-result-factory')
const { ErrorAnalysisConfigBuilder } = require('../../lib/context/trace/error-analysis-config-builder')
const { ExceptionEnricher } = require('../../lib/context/trace/exception-enricher')
const RecordingDataSender = require('./recording-data-sender')
const { dataSenderNullObject } = require('./data-sender-null-object')

let processAgent
let dataSenderInUse

const forwardingDataSender = {
    send(data) {
        dataSenderInUse.send(data)
    },
    sendStat(stats) {
        dataSenderInUse.sendStat(stats)
    },
    sendPing() {
        dataSenderInUse.sendPing()
    },
    sendSupportedServicesCommand() {
        dataSenderInUse.sendSupportedServicesCommand()
    },
    close() {
        dataSenderInUse.close()
    },
}

class ProcessAgentBuilder extends AgentBuilder {
    constructor(json = {}) {
        const config = new ConfigBuilder(Object.assign({}, require('../fixtures/pinpoint-config-test.json'), json)).build()
        super(config)

        const uriStatsConfig = new UriStatsConfigBuilder(config).build()
        if (uriStatsConfig.isUriStatsEnabled()) {
            this.setSpanRecorderFactory(new UriStatsSpanRecorderFactory(config, uriStatsConfig))
            this.addEnricher(new TraceCompletionEnricher(new UriStatsRepositoryBuilder(uriStatsConfig).build()))
        }
        if (new SqlStatsConfigBuilder(config).build().isSqlStatsEnabled()) {
            this.setParsingResultFactory(new UidParsingResultFactory())
        }
        const errorAnalysisConfig = new ErrorAnalysisConfigBuilder(config).build()
        if (errorAnalysisConfig.isErrorAnalysisEnabled()) {
            this.addEnricher(new ExceptionEnricher(errorAnalysisConfig))
        }
    }

    // The first build() in the process also starts the agent of the test process, which turns its ModuleHook on,
    // so a test file that loads an instrumented module calls startAgent() before it requires that module
    build() {
        if (!processAgent) {
            processAgent = startProcessAgent(this.config)
        }
        localStorage.disable()
        dataSenderInUse.close()
        dataSenderInUse = this.dataSender

        const traceContextBuilder = new TraceContextBuilder(this.config)
            .setDataSender(forwardingDataSender)
            .setSpanRecorderFactory(this.spanRecorderFactory)
            .setParsingResultFactory(this.parsingResultFactory)
        this.enrichers.forEach(enricher => traceContextBuilder.addEnricher(enricher))
        Object.assign(processAgent.getTraceContext(), traceContextBuilder.build(processAgent.agentStartTime))
        processAgent.config = this.config
        return processAgent
    }
}

function startAgent() {
    return nullDataSenderAgent()
}

function nullDataSenderAgent(json) {
    return new ProcessAgentBuilder(json).setDataSender(dataSenderNullObject).build()
}

// Starts the agent with a sender of its own, so the start data (AgentInfo, the supported services command)
// does not reach the sender of whichever test builds first
function startProcessAgent(config) {
    dataSenderInUse = new RecordingDataSender()
    const agent = new AgentBuilder(config)
        .setDataSender(forwardingDataSender)
        .disablePingScheduler()
        .disableStatsScheduler()
        .build()
    agent.start()
    return agent
}

module.exports = {
    ProcessAgentBuilder,
    startAgent,
    nullDataSenderAgent,
}
