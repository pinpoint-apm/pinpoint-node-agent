/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const samplingFlag = require('../../sampler/sampling-flag')

class Header {
    static traceId = 'Pinpoint-TraceID'
    static spanId = 'Pinpoint-SpanID'
    static parentSpanId = 'Pinpoint-pSpanID'
    static sampled = 'Pinpoint-Sampled'
    static flags = 'Pinpoint-Flags'
    static parentApplicationName = 'Pinpoint-pAppName'
    static parentApplicationType = 'Pinpoint-pAppType'
    static parentApplicationNamespace = 'Pinpoint-pAppNamespace'
    static host = 'Pinpoint-Host'
}

class TraceHeader {
    static newTrace = new TraceHeader()
    static disable = new TraceHeader()

    constructor(transactionId, spanId, parentSpanId, flags) {
        this.transactionId = transactionId
        this.spanId = spanId
        this.parentSpanId = parentSpanId
        this.flags = flags
    }

    isNewTrace() {
        return this === TraceHeader.newTrace
    }

    isDisable() {
        return this === TraceHeader.disable
    }

    getHost() {
        return this.host
    }

    getParentApplicationName() {
        return this.parentApplicationName
    }

    getParentApplicationType() {
        return this.parentApplicationType
    }
}

class TraceHeaderBuilder {
    constructor(request) {
        this.request = request
    }

    // DefaultTraceHeaderReader.java
    build() {
        if (this.request.isUndefinedRequest()) {
            return TraceHeader.disable
        }

        if (this.isDisableSamplingFlag()) {
            return TraceHeader.disable
        }

        const traceId = this.request.getHeader(Header.traceId)
        if (!traceId) {
            return TraceHeader.newTrace
        }

        const parentSpanId = this.request.getHeader(Header.parentSpanId)
        if (!parentSpanId) {
            return TraceHeader.newTrace
        }

        const spanId = this.request.getHeader(Header.spanId)
        if (!spanId) {
            return TraceHeader.newTrace
        }

        flags = parseInt(this.request.getHeader(Header.flags) ?? '0')
        if (Number.isNaN(flags)) {
            flags = 0
        }

        const traceHeader = new TraceHeader(traceId, spanId, parentSpanId, flags)

        // ServerRequestRecorder.java: recordParentInfo
        const parentApplicationName = this.request.getHeader(Header.parentApplicationName)
        if (!parentApplicationName) {
            return traceHeader
        }

        traceHeader.parentApplicationName = parentApplicationName
        traceHeader.host = this.request.getHeader(Header.host)
        traceHeader.parentApplicationNamespace = this.request.getHeader(Header.parentApplicationNamespace)

        let parentApplicationType = parseInt(this.request.getHeader(Header.parentApplicationType) ?? ServiceType.undefinedServiceType.getCode())
        if (Number.isNaN(parentApplicationType)) {
            parentApplicationType = ServiceType.undefinedServiceType.getCode()
        }
        traceHeader.parentApplicationType = parentApplicationType

        return traceHeader
    }

    isDisableSamplingFlag() {
        const sampled = this.request.getHeader(Header.sampled)
        return samplingFlag.isDisableFlag(sampled)
    }
}

module.exports = TraceHeaderBuilder