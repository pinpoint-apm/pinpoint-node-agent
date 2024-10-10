/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRootBuilder = require("./trace-root-builder")
const TraceIdBuilder = require("./trace/trace-id-builder")

class RemoteTraceRoot {
    constructor(traceId, traceRoot) {
        this.traceId = traceId
        this.traceRoot = traceRoot
    }

    getTraceStartTime() {
        return this.traceRoot.getTraceStartTime()
    }
}

class RemoteTraceRootBuilder {
    constructor(agentInfo) {
        this.agentInfo = agentInfo
    }

    setTraceId(traceId) {
        this.traceId = traceId
        return this
    }

    build(transactionId) {
        if (this.traceId) {
            return new RemoteTraceRoot(this.traceId, new TraceRootBuilder(this.agentInfo.agentId).build(transactionId))
        }

        const traceId = new TraceIdBuilder(this.agentInfo, transactionId).build()
        return new RemoteTraceRoot(traceId, new TraceRootBuilder(this.agentInfo.agentId).build(transactionId))
    }
}

module.exports = RemoteTraceRootBuilder