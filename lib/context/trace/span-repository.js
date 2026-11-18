/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')
const { ExceptionMetaDataBuilder } = require('./exception-meta-data-builder')

// bufferSize in DefaultContextConfig.java
const bufferSize = 20
// BufferedStorage.java
class SpanRepository {
    constructor(spanChunkBuilder, dataSender) {
        this.spanChunkBuilder = spanChunkBuilder
        this.dataSender = dataSender
        this.buffer = []
        this.exceptions = []
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
        this.exceptions = this.exceptions.concat(this.filterExceptions(spanEvents))
        this.spanChunkBuilder.setKeyTime(spanEvents[0]?.getStartTime())
        this.dataSender.send(this.spanChunkBuilder.build(spanEvents))
    }

    filterExceptions(spanEvents) {
        if (!Array.isArray(spanEvents) || spanEvents.length === 0) {
            return []
        }

        const exceptions = spanEvents
            .map(spanEvent => spanEvent?.exception)
            .filter(Boolean)
            .flat()

        if (exceptions.length === 0) {
            return []
        }

        return exceptions
    }

    storeSpan(spanBuilder) {
        if (!spanBuilder) {
            return
        }
        // GrpcSpanProcessorV2.java: postProcess(Span span, pSpan)
        const sortedSpanEventBuilders = calculateStartElapsedTime(this.bufferDrain(), spanBuilder.getStartTime())
        const spanEvents = sortedSpanEventBuilders.map(builder => builder.build())
        spanBuilder.setSpanEventList(spanEvents)
        this.dataSender.send(spanBuilder.build())

        this.exceptions = this.exceptions.concat(this.filterExceptions(spanEvents))
        this.sendExceptionMetaData(spanBuilder.getTraceRoot())
    }

    flush() {
        const buffer = this.bufferDrain()
        this.sendSpanChunk(buffer)
        this.sendExceptionMetaData(this.spanChunkBuilder.getTraceRoot())
    }

    sendExceptionMetaData(traceRoot) {
        if (this.exceptions.length < 1) {
            return
        }
        const exceptions = this.exceptions
        this.exceptions = []

        const builder = new ExceptionMetaDataBuilder(traceRoot)
        const uriTemplate = traceRoot.getEnricher('uriStats.uriTemplate')
        if (uriTemplate) {
            builder.setUriTemplate(uriTemplate)
        }
        exceptions.forEach(exception => builder.addException(exception))
        this.dataSender.send(builder.build())
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
