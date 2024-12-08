/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const spanMessages = require('../data/v1/Span_pb')
class Span {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }

    isSpan() {
        return true
    }

    toProtocolBuffer() {
        const pSpanMessage = new spanMessages.PSpanMessage()
        const pSpan = new spanMessages.PSpan()
        pSpan.setVersion(1)

        const pTransactionId = this.traceRoot.getTraceId().toProtocolBuffer()
        pSpan.setTransactionid(pTransactionId)

        pSpan.setSpanid(this.traceRoot.getTraceId().getSpanId())
        pSpan.setParentspanid(this.traceRoot.getTraceId().getParentSpanId())
        pSpan.setStarttime(this.startTime)
        pSpan.setElapsed(this.elapsedTime)
        pSpan.setApiid(this.apiId)
        pSpan.setServicetype(this.serviceType)

        const pAcceptEvent = new spanMessages.PAcceptEvent()
        pAcceptEvent.setRpc(this.rpc)
        pAcceptEvent.setEndpoint(this.endPoint ?? 'UNKNOWN')
        pAcceptEvent.setRemoteaddr(this.remoteAddress ?? 'UNKNOWN')

        const pParentInfo = new spanMessages.PParentInfo()
        if (this.parentApplicationType) {
            pParentInfo.setParentapplicationtype(this.parentApplicationType)
        }
        if (this.parentApplicationName) {
            pParentInfo.setParentapplicationname(this.parentApplicationName)
        }
        if (this.acceptorHost) {
            pParentInfo.setAcceptorhost(this.acceptorHost)
        }
        pAcceptEvent.setParentinfo(pParentInfo)
        pSpan.setAcceptevent(pAcceptEvent)

        pSpan.setFlag(this.traceRoot.getTraceId().getFlags())

        if (this.traceRoot.hasErrorCode()) {
            pSpan.setErr(this.traceRoot.getShared().getErrorCode())
        }

        if (this.applicationServiceType) {
            pSpan.setApplicationservicetype(this.applicationServiceType)
        }
        // TODO: SpanMessageMapperImpl.java: spanTraceRootSharedLoggingInfo loggingTransactionInfo

        this.spanEventList.forEach(spanEvent => pSpan.addSpanevent(spanEvent.toProtocolBuffer()))
        this.annotations.forEach(annotation => pSpan.addAnnotation(annotation.pAnnotation()))

        pSpanMessage.setSpan(pSpan)
        return pSpanMessage
    }
}

class SpanBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.annotations = []
        this.startTime = traceRoot.getTraceStartTime()
    }

    setServiceType(serviceType) {
        this.serviceType = serviceType
        return this
    }

    getStartTime() {
        return this.startTime
    }

    setApiId(apiId) {
        this.apiId = apiId
        return this
    }

    setRpc(rpc) {
        this.rpc = rpc
        return this
    }

    setEndPoint(endPoint) {
        this.endPoint = endPoint
        return this
    }

    setRemoteAddress(remoteAddress) {
        this.remoteAddress = remoteAddress
        return this
    }

    addAnnotation(annotation) {
        this.annotations.push(annotation)
        return this
    }

    setExceptionInfo(id, message) {
        this.exceptionInfo = { id, message }
        return this
    }

    setAcceptorHost(acceptorHost) {
        this.acceptorHost = acceptorHost
        return this
    }

    setParentApplicationName(parentApplicationName) {
        this.parentApplicationName = parentApplicationName
        return this
    }

    setParentApplicationType(parentApplicationType) {
        this.parentApplicationType = parentApplicationType
        return this
    }

    getTraceRoot() {
        return this.traceRoot
    }

    setSpanEventList(spanEventList) {
        this.spanEventList = spanEventList
        return this
    }

    setApplicationServiceType(applicationServiceType) {
        this.applicationServiceType = applicationServiceType
        return this
    }

    markAfterTime() {
        this.elapsedTime = Date.now() - this.startTime
        return this
    }

    build() {
        const span = new Span(this.traceRoot)
        span.serviceType = this.serviceType
        span.startTime = this.startTime || Date.now()
        span.elapsedTime = this.elapsedTime
        span.apiId = this.apiId
        span.rpc = this.rpc
        span.endPoint = this.endPoint
        span.remoteAddress = this.remoteAddress
        span.annotations = this.annotations
        span.exceptionInfo = this.exceptionInfo
        span.acceptorHost = this.acceptorHost
        span.parentApplicationName = this.parentApplicationName
        span.parentApplicationType = this.parentApplicationType
        span.spanEventList = this.spanEventList ?? []
        span.applicationServiceType = this.applicationServiceType
        return span
    }
}

module.exports = SpanBuilder