'use strict'

const {convertIntStringValue, convertNextEvent, addAnnotations} = require('../data/grpc-data-convertor')
const spanMessages = require('../data/grpc/Span_pb')

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

    get pSpanEvents() {
        const keyTime = this.keyTime
        let events = []
        if (this.spanEvents.length > 0) {
            this.spanEvents.forEach(spanEvent => events.push(this.convertSpanEvent(spanEvent, keyTime)))
        }
        return events
    }

    convertSpanEvent(spanEvent, keyTime) {
        const pSpanEvent = new spanMessages.PSpanEvent()
        pSpanEvent.setSequence(spanEvent.sequence)
        pSpanEvent.setDepth(spanEvent.depth)

        const startElapsedTime = spanEvent.startTime - keyTime
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

    get keyTime() {
        if (this.spanEvents.length < 1) {
            return 0
        }
        return this.spanEvents[0].startTime
    }
}

module.exports = SpanEvents