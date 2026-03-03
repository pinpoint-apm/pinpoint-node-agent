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
const { makeStatsRepository } = require('./lib/metric/uri-stats')
const { UriStatsMonitor } = require('./lib/metric/uri-stats-monitor')
const { UriStatsConfigBuilder } = require('./lib/metric/uri-stats-config-builder')
const { SpanRecorderEnricher } = require('./lib/context/trace/enricher/span-recorder-enricher')

const config = new ConfigBuilder().build()
const uriStatsConfig = new UriStatsConfigBuilder(config).build()

const agentInfo = AgentInfo.make(config)
const defaultLogger = logger.getLogger(LogBuilder.createDefaultLogBuilder().setConfig(config).build())
const agentBuilder = new AgentBuilder(agentInfo)
                .setConfig(config)
                .setLogger(defaultLogger)

if (uriStatsConfig.isUriStatsEnabled()) {
    agentBuilder.addService((dataSender) => {
                    const repository = makeStatsRepository(uriStatsConfig)
                    const statsMonitor = new UriStatsMonitor(dataSender, repository)
                    statsMonitor.start()
                    return {
                        shutdown: function () {
                            statsMonitor.stop()
                        }
                    }
                })
    agentBuilder.addEnricher(new SpanRecorderEnricher(uriStatsConfig))
}
const agent = agentBuilder.build()
agent.start()
module.exports = agent