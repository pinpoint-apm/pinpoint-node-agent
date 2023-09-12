/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

class SpanBuilder {
    constructor(traceId, agentId, applicationName, applicationServiceType, agentStartTime, serviceType, host, parentApplicationName, parentApplicationType) {
        this.traceId = traceId
        this.agentId = agentId
        this.applicationName = applicationName
        this.agentStartTime = agentStartTime
        this.serviceType = serviceType
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
        this.applicationServiceType = applicationServiceType
        this.loggingTransactionInfo = null
        this.version = 1
        this.acceptorHost = host
        this.parentApplicationName = parentApplicationName
        this.parentApplicationType = parentApplicationType
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