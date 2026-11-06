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

let processAgent
let dataSenderInUse

// Mock tests read a sender's fields through what holds it (agent.dataSender.mockSpans),
// so the sender the process agent keeps forwards every field to the test's sender
const forwardingDataSender = new Proxy({}, {
    get(target, property) {
        return Reflect.get(dataSenderInUse, property)
    },
    set(target, property, value) {
        return Reflect.set(dataSenderInUse, property, value)
    },
    defineProperty(target, property, descriptor) {
        return Reflect.defineProperty(dataSenderInUse, property, descriptor)
    },
})

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

    build() {
        if (!processAgent) {
            dataSenderInUse = this.dataSender
            this.dataSender = forwardingDataSender
            processAgent = super.build()
            return processAgent
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

module.exports = {
    ProcessAgentBuilder,
}
