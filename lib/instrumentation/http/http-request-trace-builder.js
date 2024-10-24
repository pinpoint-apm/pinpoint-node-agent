/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')
const TraceHeaderBuilder = require('./trace-header-builder')
const ServiceType = require('../../constant/service-type')

class HttpRequestTrace {
    constructor(rpcName, traceFactory) {
        this.rpcName = rpcName
        this.traceFactory = traceFactory
    }

    makeTrace() {
        return this.traceFactory()
    }
}

class IncomingMessageHeaderReader {
    constructor(request) {
        this.request = request
    }

    getHeader(name) {
        return this.request.headers[name]
    }

    isUndefinedRequest() {
        return !this.request || !this.request.headers
    }

    getUrlPathname() {
        return new URL(`http://${process.env.HOST ?? 'localhost'}${this.request.url}`).pathname
    }

    getRemoteAddress() {
        return this.getHeader('x-forwarded-for')?.split(',').trim().shift() ?? this.socket?.remoteAddress
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
            return new HttpRequestTrace(this.request.getUrlPathname(), () => {
                const trace = this.traceContext.newTraceObject2()
                this.record(trace)
                return trace
            })
        }

        return new HttpRequestTrace(this.request.getUrlPathname(), () => {
            const trace = this.traceContext.continueTraceObject()
            this.record(trace)
            
            // ServerRequestRecorder.java: recordParentInfo
            trace.recordAcceptorHost(traceHeader.getHost())
            trace.recordParentApplication(traceHeader.getParentApplicationName(), traceHeader.getParentApplicationType())
            return trace
        })
    }

    // ServerRequestRecorder.java: record
    // this.headerRecorder.recordHeader(recorder, request); unsupport features
    // this.cookieRecorder.recordCookie(recorder, request); unsupport features
    // record serviceType: traceContext.newTraceObject() Trace class constructor
    // ServletRequestListener.java: createTrace(REQ request)
    record(trace) {
        trace.recordServiceType(ServiceType.node)
        trace.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
        trace.recordRpc(this.request.getUrlPathname())
        trace.recordEndPoint(this.request.getHeader('host'))
        trace.recordRemoteAddress(this.request.getRemoteAddress())
    }
}

module.exports = HttpRequestTraceBuilder