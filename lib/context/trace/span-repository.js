/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')

// bufferSize in DefaultContextConfig.java
const bufferSize = 20
// BufferedStorage.java
class SpanRepository {
    constructor(spanChunkBuilder, dataSender, agentInfo) {
        this.spanChunkBuilder = spanChunkBuilder
        this.dataSender = dataSender
        this.buffer = []
        this.agentInfo = agentInfo
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

    sendSpanChunk(spanEventBuilders) {
        if (spanEventBuilders.length < 1) {
            return
        }
        // GrpcSpanProcessorV2.java: postProcess(SpanChunk spanChunk, pSpanChunk)
        const sortedSpanEventBuilders = calculateStartElapsedTime(spanEventBuilders)
        const spanEvents = sortedSpanEventBuilders.map(builder => builder.build())
        this.spanChunkBuilder.setKeyTime(spanEvents[0]?.getStartTime())
        this.spanChunkBuilder.setApplicationServiceType(this.agentInfo.getApplicationServiceType())
        this.dataSender.send(this.spanChunkBuilder.build(spanEvents))
    }

    storeSpan(spanBuilder) {
        if (!spanBuilder) {
            return
        }
        // GrpcSpanProcessorV2.java: postProcess(Span span, pSpan)
        const sortedSpanEventBuilders = calculateStartElapsedTime(this.bufferDrain(), spanBuilder.getStartTime())
        const spanEvents = sortedSpanEventBuilders.map(builder => builder.build())
        spanBuilder.setSpanEventList(spanEvents)
        spanBuilder.setApplicationServiceType(this.agentInfo.getApplicationServiceType())
        this.dataSender.send(spanBuilder.build())
    }

    flush() {
        const buffer = this.bufferDrain()
        this.sendSpanChunk(buffer)
    }
}

module.exports = SpanRepository

function calculateStartElapsedTime(spanEvents, keyTime) {
    if (spanEvents.length === 0) {
        return spanEvents
    }

    const sorted = Array.from(spanEvents).sort(SpanEventBuilder.comparator)
    sorted.reduce((previousStartTime, spanEventBuilder) => {
        const startElapsedTime = spanEventBuilder.getStartTime() - previousStartTime
        spanEventBuilder.setStartElapsedTime(startElapsedTime)
        return spanEventBuilder.getStartTime()
    }, keyTime ?? sorted[0].getStartTime())
    return sorted
}
