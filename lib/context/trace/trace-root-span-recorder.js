/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceRootSpanRecorder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }

    canSampled() {
        return true
    }

    isRoot() {
        return this.traceRoot.getTraceId().isRoot()
    }

    recordUriTemplate(uriTemplate, force = false) {
        this.traceRoot.getShared().setUriTemplate(uriTemplate, force)
    }

    recordUriHttpMethod(httpMethod) {
        this.traceRoot.getShared().setUriHttpMethod(httpMethod)
    }
}

module.exports = TraceRootSpanRecorder