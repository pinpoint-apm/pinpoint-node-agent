/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRoot = require('./trace/trace-root')
const TraceIdBuilder = require('./trace/trace-id-builder')

class RemoteTraceRoot extends TraceRoot {
    constructor(traceId, agentId, transactionId) {
        super(agentId, Date.now(), transactionId)
        this.traceId = traceId
    }

    isSampled() {
        return true
    }

    getTraceId() {
        return this.traceId
    }

    toString() {
        return `RemoteTraceRoot{traceId=${this.traceId.toString()}, ${super.toString()}}`
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
            const traceId = new TraceIdBuilder(this.agentInfo.getAgentId(), this.agentInfo.getAgentStartTime(), this.transactionId).build()
            return new RemoteTraceRoot(traceId, agentId, this.transactionId)
        }

        return new RemoteTraceRoot(this.traceId, agentId, this.transactionId)
    }

    isNewTraceRoot() {
        return !this.traceId
    }
}

module.exports = RemoteTraceRootBuilder