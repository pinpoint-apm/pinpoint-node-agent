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

    setKeyTime(keyTime) {
        this.keyTime = keyTime
        return this
    }

    setApplicationServiceType(applicationServiceType) {
        this.applicationServiceType = applicationServiceType
        return this
    }

    build(spanEventList) {
        const spanChunk = new SpanChunk(this.traceRoot, spanEventList)
        spanChunk.keyTime = this.keyTime
        spanChunk.applicationServiceType = this.applicationServiceType
        return spanChunk
    }

    toString() {
        return `SpanChunkBuilder(traceRoot=${this.traceRoot}, keyTime=${this.keyTime})`
    }
}

module.exports = SpanChunkBuilder