/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const spanId = require('../span-id')

const delimiter = '^'
// DefaultTraceId.java
class TraceId {
    constructor(agentId, agentStartTime, transactionId, parentSpanId, spanId, flags) {
        this.agentId = agentId
        this.agentStartTime = agentStartTime
        this.transactionId = transactionId
        this.parentSpanId = parentSpanId
        this.spanId = spanId
        this.flags = flags
    }

    getAgentId() {
        return this.agentId
    }

    getAgentStartTime() {
        return this.agentStartTime
    }

    getTransactionId() {
        return this.transactionId
    }

    getParentSpanId() {
        return this.parentSpanId
    }

    getSpanId() {
        return this.spanId
    }

    getFlags() {
        return this.flags
    }

    getNextTraceId() {
        return new TraceId(this.agentId, this.agentStartTime, this.transactionId, this.spanId, spanId.nextSpanId(this.spanId, this.parentSpanId), this.flags)
    }

    isRoot() {
        return this.parentSpanId == spanId.nullSpanId()
    }

    toString() {
        return `TraceId(agentId=${this.agentId}, agentStartTime=${this.agentStartTime}, transactionId=${this.transactionId}, parentSpanId=${this.parentSpanId}
                    , spanId=${this.spanId}, flags=${this.flags})`
    }

    toStringDelimiterFormatted() {
        return [this.agentId, this.agentStartTime, this.transactionId].join(delimiter)
    }
}

class TraceIdBuilder {
    constructor(agentInfo, transactionId) {
        this.agentInfo = agentInfo
        this.transactionId = transactionId
        this.parentSpanId = spanId.nullSpanId()
    }

    make(transactionId) {
        return new TraceIdBuilder(this.agentInfo, transactionId)
    }

    setSpanId(spanId) {
        this.spanId = spanId
        return this
    }

    setParentSpanId(parentSpanId) {
        this.parentSpanId = parentSpanId
        return this
    }

    build() {
        return new TraceId(this.agentInfo.getAgentId(), this.agentInfo.getAgentStartTime()
                , this.transactionId, this.parentSpanId, this.spanId ?? spanId.newSpanId(), 0)
    }
}

module.exports = TraceIdBuilder