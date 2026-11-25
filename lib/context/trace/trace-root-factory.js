/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRootBuilder = require('../trace-root-builder')
const RemoteTraceRootBuilder = require('../remote-trace-root-builder')
const { UriStatsConfigBuilder } = require('../../metric/uri/uri-stats-config-builder')
const { UriStatsShared, emptyUriStatsShared } = require('../../metric/uri/uri-stats-shared')

// DefaultTraceRootFactory.java
class TraceRootFactory {
    constructor(config, agentStartTime) {
        this.config = config
        this.agentStartTime = agentStartTime
        const uriStatsConfig = new UriStatsConfigBuilder(config).build()
        this.uriStatsShared = uriStatsConfig.isUriStatsEnabled() ? new UriStatsShared(uriStatsConfig) : emptyUriStatsShared
    }

    newTraceRoot(transactionId) {
        return new RemoteTraceRootBuilder(this.config.getAgentId(), this.agentStartTime, transactionId)
            .setUriStatsShared(this.uriStatsShared)
            .build()
    }

    newDisableTraceRoot(transactionId) {
        return new TraceRootBuilder(this.config.getAgentId(), transactionId)
            .setUriStatsShared(this.uriStatsShared)
            .build()
    }

    continueTraceRoot(traceId, transactionId) {
        return new RemoteTraceRootBuilder(this.config.getAgentId(), this.agentStartTime, transactionId)
            .setTraceId(traceId)
            .setUriStatsShared(this.uriStatsShared)
            .build()
    }
}

module.exports = TraceRootFactory
