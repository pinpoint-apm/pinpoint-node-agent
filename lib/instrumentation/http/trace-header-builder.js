/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const samplingFlag = require("../../sampler/sampling-flag")

class Header {
    static sampled = 'Pinpoint-Sampled'
    static traceId = 'Pinpoint-TraceID'
    static parentSpanId = 'Pinpoint-pSpanID'
    static spanId = 'Pinpoint-SpanID'
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
}

class TraceHeaderBuilder {
    constructor(request) {
        this.request = request
    }

    // DefaultTraceHeaderReader.java
    build() {
        if (!this.request) {
            return TraceHeader.disable
        }

        if (typeof this.request.getHeader !== 'function') {
            return TraceHeader.disable
        }

        const sampled = this.sampled()
        if (sampled) {
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

        flags = parseInt(this.request.getHeader(Header.flags) || '0')
        if (Number.isNaN(flags)) {
            flags = 0
        }

        return new TraceHeader(traceId, spanId, parentSpanId, flags)
    }

    sampled() {
        const sampled = this.request.getHeader(Header.sampled)
        return samplingFlag.isSamplingFlag(sampled)
    }
}

module.exports = TraceHeaderBuilder