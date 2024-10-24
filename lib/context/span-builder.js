/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Span {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }
}

class SpanBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.annotations = []
        this.startTime = traceRoot.getTraceStartTime()
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

    build() {
        const span = new Span(this.traceRoot)
        this.startTime = this.startTime || Date.now()
        span.apiId = this.apiId
        span.rpc = this.rpc
        span.endPoint = this.endPoint
        span.remoteAddress = this.remoteAddress
        span.annotations = this.annotations
        span.exceptionInfo = this.exceptionInfo
        span.acceptorHost = this.acceptorHost
        span.parentApplicationName = this.parentApplicationName
        span.parentApplicationType = this.parentApplicationType
        return span
    }
}

module.exports = SpanBuilder