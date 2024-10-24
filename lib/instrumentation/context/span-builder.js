/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const TransactionId = require('../../context/transaction-id')
const TraceId = require('../../context/trace-id')
const Span = require('../../context/span')

class SpanBuilder {
    constructor(traceId, agentInfo) {
        this.traceId = traceId
        this.agentInfo = agentInfo
        this.startTime = Date.now()
        this.elapsedTime = 0
        this.rpc = null
        this.endPoint = null
        this.remoteAddr = null
        this.annotations = []
        this.err = null
        this.spanEventList = []
        this.apiId = null
        this.exceptionInfo = null
        this.loggingTransactionInfo = null
        this.version = 1
        this.acceptorHost = undefined
        this.parentApplicationName = undefined
        this.parentApplicationType = undefined
    }

    static makeWithSpanId(spanId, agentInfo, parentSpanId = '-1') {
        const transactionId = new TransactionId(agentInfo.agentId, agentInfo.agentStartTime)
        const traceId = new TraceId(transactionId, spanId, parentSpanId)
        const builder = new SpanBuilder(traceId, agentInfo)
        return builder
    }

    build() {
        return new Span(this.traceId, this.agentInfo)
    }
}

module.exports = SpanBuilder