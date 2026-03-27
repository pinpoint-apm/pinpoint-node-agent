/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AgentBuilder } = require('./lib/agent-builder')
const AgentInfo = require('./lib/data/dto/agent-info')
const { ConfigBuilder } = require('./lib/config-builder')
const { LogBuilder } = require('./lib/utils/log/log-builder')
const logger = require('./lib/utils/log/logger')
const { UriStatsMonitor } = require('./lib/metric/uri/uri-stats-monitor')
const { UriStatsConfigBuilder } = require('./lib/metric/uri/uri-stats-config-builder')
const { UriStatsSpanRecorderFactory } = require('./lib/metric/uri/span-recorder-factory')
const { UriStatsRepositoryBuilder } = require('./lib/metric/uri/uri-stats-repository')
const { TraceCompletionEnricher } = require('./lib/metric/uri/trace-completion-enricher')
const { ErrorAnalysisConfigBuilder } = require('./lib/context/trace/error-analysis-config-builder')
const { ExceptionEnricher } = require('./lib/context/trace/exception-enricher')

const config = new ConfigBuilder().build()

const agentInfo = AgentInfo.make(config)
const defaultLogger = logger.getLogger(LogBuilder.createDefaultLogBuilder().setConfig(config).build())
const agentBuilder = new AgentBuilder(agentInfo)
    .setConfig(config)
    .setLogger(defaultLogger)

const uriStatsConfig = new UriStatsConfigBuilder(config).build()
if (uriStatsConfig.isUriStatsEnabled()) {
    agentBuilder.setSpanRecorderFactory(new UriStatsSpanRecorderFactory(config, uriStatsConfig))
    const uriStatsRepository = new UriStatsRepositoryBuilder(uriStatsConfig).build()
    agentBuilder.addService((dataSender) => {
        const statsMonitor = new UriStatsMonitor(dataSender, uriStatsRepository)
        statsMonitor.start()
        return {
            shutdown: function () {
                statsMonitor.stop()
            }
        }
    })
    agentBuilder.addEnricher(new TraceCompletionEnricher(uriStatsRepository))
}
const errorAnalysisConfig = new ErrorAnalysisConfigBuilder(config).build()
if (errorAnalysisConfig.isErrorAnalysisEnabled()) {
    agentBuilder.addEnricher(new ExceptionEnricher(errorAnalysisConfig))
}
const agent = agentBuilder.build()
agent.start()
module.exports = agent