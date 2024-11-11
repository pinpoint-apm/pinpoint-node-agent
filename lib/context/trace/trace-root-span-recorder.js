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
}

module.exports = TraceRootSpanRecorder