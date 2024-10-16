/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceId {
    constructor(agentId, agentStartTime, transactionId) {
        this.agentId = agentId
        this.agentStartTime = agentStartTime
        this.transactionId = transactionId
    }
}

class TraceIdBuilder {
    constructor(agentInfo, transactionId) {
        this.agentInfo = agentInfo
        this.transactionId = transactionId
    }

    build() {
        return new TraceId(this.agentInfo.agentId, this.agentInfo.agentStartTime, this.transactionId)
    }
}

module.exports = TraceIdBuilder