/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanChunk = require('./span-chunk')

// DefaultAsyncSpanChunk.java
class AsyncSpanChunk extends SpanChunk {
    constructor(traceRoot, spanEventList, localAsyncId) {
        super(traceRoot, spanEventList)
        this.localAsyncId = localAsyncId
    }

    getLocalAsyncId() {
        return this.localAsyncId
    }

    toProtocolBuffer() {
        const pSpanMessage = super.toProtocolBuffer()
        const pSpanChunk = pSpanMessage.getSpanchunk()
        pSpanChunk.setLocalasyncid(this.localAsyncId.toProtocolBuffer())
        return pSpanMessage
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

    setKeyTime(keyTime) {
        this.keyTime = keyTime
        return this
    }

    setApplicationServiceType(applicationServiceType) {
        this.applicationServiceType = applicationServiceType
        return this
    }

    build(spanEventBuilders) {
        const asyncSpanChunk = new AsyncSpanChunk(this.traceRoot, spanEventBuilders, this.localAsyncId)
        asyncSpanChunk.keyTime = this.keyTime
        asyncSpanChunk.applicationServiceType = this.applicationServiceType
        return asyncSpanChunk
    }

    toString() {
        return `AsyncSpanChunkBuilder(traceRoot=${this.traceRoot}, localAsyncId=${this.localAsyncId}, keyTime=${this.keyTime})`
    }
}

module.exports = AsyncSpanChunkBuilder