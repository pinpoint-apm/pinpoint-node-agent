/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceIdBuilder = require('../../context/trace/trace-id-builder')
const samplingFlag = require('../../sampler/sampling-flag')
const Header = require('./pinpoint-header')

class TraceHeader {
    static newTrace = new TraceHeader()
    static disable = new TraceHeader()

    constructor(traceId) {
        this.traceId = traceId
    }

    isNewTrace() {
        return this === TraceHeader.newTrace
    }

    isDisable() {
        return this === TraceHeader.disable
    }

    getTraceId() {
        return this.traceId
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

        const traceIdSemicolonDelimiterFormatted = this.request.getHeader(Header.traceId)
        if (!traceIdSemicolonDelimiterFormatted) {
            return TraceHeader.newTrace
        }
        const traceIdBuilder = TraceIdBuilder.makeByHeader(traceIdSemicolonDelimiterFormatted)
        if (!traceIdBuilder) {
            return TraceHeader.newTrace
        }

        const parentSpanId = this.request.getHeader(Header.parentSpanId)
        if (!parentSpanId) {
            return TraceHeader.newTrace
        }
        traceIdBuilder.setParentSpanId(parentSpanId)

        const spanId = this.request.getHeader(Header.spanId)
        if (!spanId) {
            return TraceHeader.newTrace
        }
        traceIdBuilder.setSpanId(spanId)

        const flags = parseInt(this.request.getHeader(Header.flags) ?? '0')
        if (Number.isNaN(flags)) {
            flags = '0'
        }
        traceIdBuilder.setFlags(flags)

        const traceHeader = new TraceHeader(traceIdBuilder.build())

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