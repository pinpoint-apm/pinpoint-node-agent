/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')
const TraceHeaderBuilder = require('./trace-header-builder')
const ServiceType = require('../../context/service-type')
const annotationKey = require('../../constant/annotation-key')

class HttpRequestTrace {
    constructor(rpcName, traceFactory) {
        this.rpcName = rpcName
        this.traceFactory = traceFactory
    }

    makeTrace() {
        return this.traceFactory(this.rpcName)
    }
}

class IncomingMessageHeaderReader {
    constructor(request) {
        this.request = request
        this.url = new URL(`http://${process.env.HOST ?? 'localhost'}${this.request.url}`)
    }

    getHeader(name) {
        return this.request.headers[name]
    }

    isUndefinedRequest() {
        return !this.request || !this.request.headers
    }

    getUrlPathname() {
        return this.url.pathname
    }

    getRemoteAddress() {
        return this.getHeader('x-forwarded-for')?.trim().split(',').shift() ?? this.request.socket?.remoteAddress?.replace?.('::ffff:', '')
    }

    getQuery() {
        return this.url.searchParams?.toString()
    }

    getMethodWithURLPathname() {
        return this.request.method + ' ' + this.url.pathname
    }
}


class HttpRequestTraceBuilder {
    constructor(traceContext, request) {
        this.traceContext = traceContext
        this.request = new IncomingMessageHeaderReader(request)
    }

    // RequestTraceReader.java: read
    // ServletRequestListener.java: createTrace
    build() {
        const traceHeader = new TraceHeaderBuilder(this.request).build()
        if (traceHeader.isDisable()) {
            return new HttpRequestTrace(this.request.getUrlPathname(), () => {
                return this.traceContext.disableSampling()
            })
        }

        if (traceHeader.isNewTrace()) {
            return new HttpRequestTrace(this.request.getUrlPathname(), (rpcName) => {
                const trace = this.traceContext.newTraceObject2(rpcName)
                const spanRecorder = trace.getSpanRecorder()
                this.record(spanRecorder)
                return trace
            })
        }

        return new HttpRequestTrace(this.request.getUrlPathname(), () => {
            const trace = this.traceContext.continueTraceObject2(traceHeader.getTraceId())
            const spanRecorder = trace.getSpanRecorder()
            this.record(spanRecorder)

            // ServerRequestRecorder.java: recordParentInfo
            spanRecorder.recordAcceptorHost(traceHeader.getHost())
            spanRecorder.recordParentApplication(traceHeader.getParentApplicationName(), traceHeader.getParentApplicationType())
            return trace
        })
    }

    // ServerRequestRecorder.java: record
    // this.headerRecorder.recordHeader(recorder, request); unsupport features
    // this.cookieRecorder.recordCookie(recorder, request); unsupport features
    // record serviceType: traceContext.newTraceObject() Trace class constructor
    // ServletRequestListener.java: createTrace(REQ request)
    record(spanRecorder) {
        spanRecorder.recordServiceType(ServiceType.node)
        spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
        spanRecorder.recordRpc(this.request.getUrlPathname())
        spanRecorder.recordEndPoint(this.request.getHeader('host'))
        spanRecorder.recordRemoteAddress(this.request.getRemoteAddress())
        spanRecorder.recordAttribute(annotationKey.HTTP_PARAM, this.request.getQuery())
        spanRecorder.recordAttribute(annotationKey.HTTP_INTERNAL_DISPLAY, this.request.getMethodWithURLPathname())
    }
}

module.exports = HttpRequestTraceBuilder
