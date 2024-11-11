/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const samplingFlag = require('../../sampler/sampling-flag')
const Header = require('./pinpoint-header')

// DefaultRequestTraceWriter.java
class HttpClientRequest {
    constructor(request) {
        this.request = request
        this.host = this.getHeader('host')
    }

    // write(T header)
    writeSampledHeaderFalse() {
        this.setHeader(Header.sampled, samplingFlag.samplingRateFalse())
    }

    // write(T header, final TraceId traceId, final String host)
    write(traceId, agentInfo) {
        this.setHeader(Header.traceId, traceId.toStringDelimiterFormatted())
        this.setHeader(Header.spanId, traceId.getSpanId())
        this.setHeader(Header.parentSpanId, traceId.getParentSpanId())
        this.setHeader(Header.flags, traceId.getFlags())
        this.setHeader(Header.parentApplicationName, agentInfo.getApplicationName())
        this.setHeader(Header.parentApplicationType, agentInfo.getServiceType())

        if (this.host) {
            this.setHeader(Header.host, this.getHost())
        }
    }

    setHeader(name, value) {
        this.request.setHeader?.(name, value)
    }

    getHeader(name) {
        return this.request.getHeader?.(name)
    }

    getHost() {
        return this.host
    }

    getHostWithPathname() {
        return this.getHost() + new URL(`${this.request.protocol}//${this.getHost()}${this.request.path}`).pathname
    }
}

class HttpOutgoingRequestHeader {
    constructor(context, request) {
        this.traceContext = context
        this.request = new HttpClientRequest(request)
    }

    getHostWithPathname() {
        return this.request.getHostWithPathname()
    }

    getHost() {
        return this.request.getHost()
    }

    writePinpointHeader() {
        const trace = this.traceContext.currentTraceObject()
        if (!trace) {
            return
        }

        if (!trace.canSampled()) {
            this.request.writeSampledHeaderFalse()
            return
        }

        this.request.write(trace.getTraceId(), this.traceContext.getAgentInfo())
    }
}

module.exports = HttpOutgoingRequestHeader