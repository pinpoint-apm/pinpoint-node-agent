/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRootBuilder = require('./trace-root-builder')
const TraceIdBuilder = require('./trace/trace-id-builder')

class RemoteTraceRoot {
    constructor(traceId, traceRoot) {
        this.traceId = traceId
        this.traceRoot = traceRoot
    }

    getTraceStartTime() {
        return this.traceRoot.getTraceStartTime()
    }

    isSampled() {
        return true
    }

    getTraceId() {
        return this.traceId
    }
}

class RemoteTraceRootBuilder {
    constructor(agentInfo, transactionId) {
        this.agentInfo = agentInfo
        this.transactionId = transactionId
    }

    make(transactionId) {
        return new RemoteTraceRootBuilder(this.agentInfo, transactionId)
    }

    setTraceId(traceId) {
        this.traceId = traceId
        return this
    }

    build() {
        const agentId = this.agentInfo.getAgentId()
        if (this.isNewTraceRoot()) {
            const traceId = new TraceIdBuilder(this.agentInfo, this.transactionId).build()
            return new RemoteTraceRoot(traceId, new TraceRootBuilder(agentId, this.transactionId).build())
        }

        return new RemoteTraceRoot(this.traceId, new TraceRootBuilder(agentId, this.transactionId).build())
    }

    isNewTraceRoot() {
        return !this.traceId
    }
}

module.exports = RemoteTraceRootBuilder