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
const { UriStatsMonitor } = require('./lib/metric/uri-stats-monitor')
const { UriStatsConfigBuilder } = require('./lib/metric/uri-stats-config-builder')
const { SpanRecorderEnricher } = require('./lib/context/trace/enricher/span-recorder-enricher')
const { UriStatsRepositoryBuilder } = require('./lib/metric/uri-stats-repository')
const { TraceCompletionEnricher } = require('./lib/context/trace/enricher/trace-completion-enricher')

const config = new ConfigBuilder().build()
const uriStatsConfig = new UriStatsConfigBuilder(config).build()
const uriStatsRepository = new UriStatsRepositoryBuilder(uriStatsConfig).build()

const agentInfo = AgentInfo.make(config)
const defaultLogger = logger.getLogger(LogBuilder.createDefaultLogBuilder().setConfig(config).build())
const agentBuilder = new AgentBuilder(agentInfo)
                .setConfig(config)
                .setLogger(defaultLogger)

if (uriStatsConfig.isUriStatsEnabled()) {
    agentBuilder.addService((dataSender) => {
                    const statsMonitor = new UriStatsMonitor(dataSender, uriStatsRepository)
                    statsMonitor.start()
                    return {
                        shutdown: function () {
                            statsMonitor.stop()
                        }
                    }
                })
    agentBuilder.addEnricher(new SpanRecorderEnricher(uriStatsConfig))
    agentBuilder.addEnricher(new TraceCompletionEnricher(uriStatsRepository))
}
const agent = agentBuilder.build()
agent.start()
module.exports = agent