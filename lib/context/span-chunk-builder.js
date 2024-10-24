/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanChunk = require('./trace/span-chunk2')

class SpanChunkBuilder {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
    }

    build(spanEventList) {
        return new SpanChunk(this.traceRoot, spanEventList)
    }
}

module.exports = SpanChunkBuilder