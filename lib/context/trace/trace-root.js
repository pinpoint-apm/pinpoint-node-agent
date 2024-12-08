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

    getAgentId() {
        return this.agentId
    }

    getTraceStartTime() {
        return this.traceStartTime
    }

    getTransactionId() {
        return this.transactionId
    }

    isSampled() {
        return false
    }

    getShared() {
        if (!this.shared) {
            this.shared = new Shared()
        }
        return this.shared
    }

    hasErrorCode() {
        return this.shared?.getErrorCode?.()
    }

    toString() {
        return `TraceRoot(agentId=${this.agentId}, traceStartTime=${this.traceStartTime}, transactionId=${this.transactionId})`
    }
}

class Shared {
    maskErrorCode(errorCode) {
        this.errorCode = errorCode
    }

    getErrorCode() {
        return this.errorCode
    }
}

module.exports = TraceRoot