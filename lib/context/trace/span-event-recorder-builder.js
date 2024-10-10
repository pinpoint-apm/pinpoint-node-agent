/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SpanEventRecorder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }
}

class SpanEventRecorderBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }

    build() {
        return new SpanEventRecorder(this.traceRoot)
    }
}

module.exports = SpanEventRecorderBuilder