/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const spanMessages = require('../../data/v1/Span_pb')

class SpanChunk {
    constructor(traceRoot, spanEventList) {
        this.traceRoot = traceRoot
        this.spanEventList = spanEventList
    }

    getTraceRoot() {
        return this.traceRoot
    }

    toProtocolBuffer() {
        const pSpanMessage = new spanMessages.PSpanMessage()
        const pSpanChunk = new spanMessages.PSpanChunk()
        pSpanChunk.setVersion(1)

        const pTransactionId = this.traceRoot.getTraceId().toProtocolBuffer()
        pSpanChunk.setTransactionid(pTransactionId)

        pSpanChunk.setSpanid(this.traceRoot.getTraceId().getSpanId())
        pSpanChunk.setEndpoint(this.endPoint)

        if (this.applicationServiceType) {
            pSpanChunk.setApplicationservicetype(this.applicationServiceType)
        }

        // GrpcSpanProcessorV2.java: postProcess
        if (this.keyTime) {
            pSpanChunk.setKeytime(this.keyTime)
        }

        this.spanEventList.forEach(spanEvent => {
            pSpanChunk.addSpanevent(spanEvent.toProtocolBuffer())
        })

        pSpanMessage.setSpanchunk(pSpanChunk)
        return pSpanMessage
    }

    // GrpcSpanProcessorV2.java: getKeyTime
    getKeyTime() {
        return this.keyTime
    }

    toString() {
        return `SpanChunk(traceRoot=${this.traceRoot}, spanEventList=${this.spanEventList})`
    }
}

module.exports = SpanChunk