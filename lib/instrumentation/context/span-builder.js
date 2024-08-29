/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const TransactionId = require("../../context/transaction-id")
const TraceId = require("../../context/trace-id")

class SpanBuilder {
    constructor(traceId, agentInfo) {
        this.traceId = traceId
        this.agentId = agentInfo.agentId
        this.applicationName = agentInfo.applicationName
        this.agentStartTime = agentInfo.agentStartTime
        this.serviceType = agentInfo.serviceType
        this.spanId = traceId.spanId
        this.parentSpanId = traceId.parentSpanId
        this.startTime = Date.now()
        this.elapsedTime = 0
        this.rpc = null
        this.endPoint = null
        this.remoteAddr = null
        this.annotations = []
        this.flag = traceId.flag
        this.err = null
        this.spanEventList = []
        this.apiId = null
        this.exceptionInfo = null
        this.applicationServiceType = agentInfo.applicationServiceType
        this.loggingTransactionInfo = null
        this.version = 1
        this.acceptorHost = undefined
        this.parentApplicationName = undefined
        this.parentApplicationType = undefined
    }

    static makeSpanBuilderWithSpanId(spanId, agentInfo, parentSpanId = '-1') {
        const transactionId = new TransactionId(agentInfo.agentId, agentInfo.agentStartTime)
        const traceId = new TraceId(transactionId, spanId, parentSpanId)
        const builder = new SpanBuilder(traceId, agentInfo)
        return builder
    }

    static valueOf(span) {
        const builder = new SpanBuilder(span.traceId, span.agentId, span.applicationName, span.applicationServiceType, span.agentStartTime, span.serviceType, span.acceptorHost, span.parentApplicationName, span.parentApplicationType)
        builder.spanId = span.spanId
        builder.parentSpanId = span.parentSpanId
        builder.startTime = span.startTime
        builder.elapsedTime = span.elapsedTime
        builder.rpc = span.rpc
        builder.endPoint = span.endPoint
        builder.remoteAddr = span.remoteAddr
        builder.annotations = span.annotations
        builder.flag = span.flag
        builder.err = span.err
        builder.spanEventList = span.spanEventList
        builder.apiId = span.apiId
        builder.exceptionInfo = span.exceptionInfo
        builder.loggingTransactionInfo = span.loggingTransactionInfo
        builder.version = span.version
        return builder
    }
}

module.exports = SpanBuilder