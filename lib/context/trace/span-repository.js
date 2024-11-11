/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// bufferSize in DefaultContextConfig.java
const bufferSize = 20
// BufferedStorage.java
class SpanRepository {
    constructor(spanChunkBuilder, dataSender) {
        this.spanChunkBuilder = spanChunkBuilder
        this.dataSender = dataSender
        this.buffer = []
    }

    storeSpanEvent(spanEvent) {
        if (!spanEvent) {
            return
        }

        this.buffer.push(spanEvent)

        if (this.isOverflow()) {
            const buffer = this.bufferDrain()
            this.sendSpanChunk(buffer)
        }
    }

    isOverflow() {
        return this.buffer.length >= bufferSize
    }

    bufferDrain() {
        const copy = this.buffer
        this.buffer = []
        return copy
    }

    sendSpanChunk(spanEvents) {
        const spanChunk = this.spanChunkBuilder.build(spanEvents)
        this.dataSender.send(spanChunk)
    }

    storeSpan(span) {
        if (span) {
            span.spanEventList = this.bufferDrain()
        }
        this.dataSender.send(span)
    }

    flush() {
        const buffer = this.bufferDrain()
        this.sendSpanChunk(buffer)
    }
}

module.exports = SpanRepository