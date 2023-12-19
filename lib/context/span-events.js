/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { convertIntStringValue, convertNextEvent, addAnnotations } = require('../data/grpc-data-convertor')
const spanMessages = require('../data/v1/Span_pb')

class SpanEvents {
    constructor(spanEvents) {
        this.spanEvents = this.sortedSpanEvents(spanEvents || [])
    }

    sortedSpanEvents(spanEvents) {
        return Array.from(spanEvents).sort((a, b) => {
            if (a.sequence < b.sequence) {
                return -1
            }
            if (a.sequence > b.sequence) {
                return 1
            }
            return 0
        })
    }

    getpSpanEvents(keyTime) {
        let events = []
        return this.pSpanEvents(events, keyTime)
    }

    pSpanEvents(events, keyTime) {
        if (this.spanEvents.length > 0) {
            this.spanEvents.reduce((previousStartTime, spanEvent) => {
                const startElapsedTime = spanEvent.startTime - previousStartTime
                events.push(this.convertSpanEvent(spanEvent, startElapsedTime))
                return spanEvent.startTime
            }, keyTime)
        }
        return events
    }

    convertSpanEvent(spanEvent, startElapsedTime) {
        const pSpanEvent = new spanMessages.PSpanEvent()
        pSpanEvent.setSequence(spanEvent.sequence)
        pSpanEvent.setDepth(spanEvent.depth)

        pSpanEvent.setStartelapsed(startElapsedTime)
        pSpanEvent.setEndelapsed(spanEvent.endElapsed)
        pSpanEvent.setServicetype(spanEvent.serviceType)
        pSpanEvent.setApiid(spanEvent.apiId)
        pSpanEvent.setExceptioninfo(convertIntStringValue(spanEvent.exceptionInfo))
        pSpanEvent.setNextevent(convertNextEvent(spanEvent))
        pSpanEvent.setAsyncevent(spanEvent.nextAsyncId)

        addAnnotations(pSpanEvent, spanEvent.annotations)
        return pSpanEvent
    }
}

module.exports = SpanEvents