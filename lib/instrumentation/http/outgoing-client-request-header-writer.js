/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const samplingFlag = require('../../sampler/sampling-flag')
const Header = require('./pinpoint-header')

class OutgoingClientRequestHeaderWriter {
    constructor(request) {
        this.request = request
    }

    // write(T header)
    writeSampledHeaderFalse() {
        this.request.setHeader(Header.sampled, samplingFlag.samplingRateFalse())
    }

        // write(T header, final TraceId traceId, final String host)
    // fLucyNetUtil.java: createOptions
    write(traceId, agentInfo) {
        this.request.setHeader(Header.traceId, traceId.toStringDelimiterFormatted())
        this.request.setHeader(Header.spanId, traceId.getSpanId())
        this.request.setHeader(Header.parentSpanId, traceId.getParentSpanId())
        this.request.setHeader(Header.flags, traceId.getFlags())
        this.request.setHeader(Header.parentApplicationName, agentInfo.getApplicationName())
        this.request.setHeader(Header.parentApplicationType, agentInfo.getServiceType())

        if (this.request.getHost()) {
            this.request.setHeader(Header.host, this.request.getHost())
        }
    }
}

module.exports = OutgoingClientRequestHeaderWriter