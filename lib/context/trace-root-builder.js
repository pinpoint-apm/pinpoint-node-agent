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

    isSampled() {
        return false
    }
}

class TraceRootBuilder {
    constructor(agentId, localTransactionId) {
        this.agentId = agentId
        this.localTransactionId = localTransactionId
        this.traceStartTime = Date.now()
    }

    make(localTransactionId) {
        return new TraceRootBuilder(this.agentId, localTransactionId)
    }

    // DefaultTraceRootFactory.java: newDisableTraceRoot
    build() {
        return new TraceRoot(this.agentId, this.traceStartTime, this.localTransactionId)
    }
}

module.exports = TraceRootBuilder