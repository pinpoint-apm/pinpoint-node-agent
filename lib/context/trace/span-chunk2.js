/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SpanChunk {
    constructor(traceRoot, spanEventList) {
        this.traceRoot = traceRoot
        this.spanEventList = spanEventList
    }
}

module.exports = SpanChunk