/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Span {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.startTime = traceRoot.getTraceStartTime()
    }
}

class SpanBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }

    build() {
        return new Span(this.traceRoot)
    }
}

module.exports = SpanBuilder