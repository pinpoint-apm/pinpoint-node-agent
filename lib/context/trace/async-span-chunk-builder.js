/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanChunk = require('./span-chunk2')

// DefaultAsyncSpanChunk.java
class AsyncSpanChunk extends SpanChunk {
    constructor(traceRoot, spanEventList, localAsyncId) {
        super(traceRoot, spanEventList)
        this.localAsyncId = localAsyncId
    }

    getLocalAsyncId() {
        return this.localAsyncId
    }

    isAsyncSpanChunk() {
        return true
    }

    toString() {
        return `AsyncSpanChunk(traceRoot=${this.traceRoot}, spanEventList=${this.spanEventList}, localAsyncId=${this.localAsyncId})`
    }
}

// AsyncSpanChunkFactory.java
class AsyncSpanChunkBuilder {
    constructor(traceRoot, localAsyncId) {
        this.traceRoot = traceRoot
        this.localAsyncId = localAsyncId
    }

    build(spanEventList) {
        return new AsyncSpanChunk(this.traceRoot, spanEventList, this.asyncId)
    }

    toString() {
        return `AsyncSpanChunkBuilder(traceRoot=${this.traceRoot}, localAsyncId=${this.localAsyncId})`
    }
}

module.exports = AsyncSpanChunkBuilder