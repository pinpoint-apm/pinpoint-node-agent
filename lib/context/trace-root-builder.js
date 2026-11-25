/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRoot = require('./trace/trace-root')

class TraceRootBuilder {
    constructor(agentId, localTransactionId) {
        this.agentId = agentId
        this.localTransactionId = localTransactionId
        this.traceStartTime = Date.now()
    }

    setUriStatsShared(uriStatsShared) {
        this.uriStatsShared = uriStatsShared
        return this
    }

    // DefaultTraceRootFactory.java: newDisableTraceRoot
    build() {
        const traceRoot = new TraceRoot(this.agentId, this.traceStartTime, this.localTransactionId)
        if (this.uriStatsShared) {
            traceRoot.setUriStatsShared(this.uriStatsShared)
        }
        return traceRoot
    }
}

module.exports = TraceRootBuilder