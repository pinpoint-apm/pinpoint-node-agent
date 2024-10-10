/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceRoot {
    constructor(agentId, traceStartTime, transactionId) {
        this.agentId = agentId
        this.traceStartTime = traceStartTime
        this.transactionId = transactionId
    }

    getTraceStartTime() {
        return this.traceStartTime
    }
}

class TraceRootBuilder {
    constructor(agentId) {
        this.agentId = agentId
    }

    build(transactionId) {
        return new TraceRoot(this.agentId, Date.now(), transactionId)
    }
}

module.exports = TraceRootBuilder