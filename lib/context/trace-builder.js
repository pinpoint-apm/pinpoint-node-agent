/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class Trace {
    constructor(span, repository, spanRecorder, spanEventRecorder) {
        this.span = span
        this.repository = repository
        this.spanRecorder = spanRecorder
        this.spanEventRecorder = spanEventRecorder
    }
    
}

class TraceBuilder {
    constructor(span, repository, spanRecorder, spanEventRecorder) {
        this.span = span
        this.repository = repository
        this.spanRecorder = spanRecorder
        this.spanEventRecorder = spanEventRecorder
    }

    build() {
        return new Trace(this.span, this.repository, this.spanRecorder, this.spanEventRecorder)
    }
}

module.exports = TraceBuilder