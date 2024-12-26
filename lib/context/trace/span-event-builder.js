/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const StackId = require('./stack-id')
const spanMessages = require('../../data/v1/Span_pb')
const IntStringValue = require('../../instrumentation/context/annotation/int-string-value')

class SpanEvent {
    constructor(sequence, depth) {
        this.sequence = sequence
        this.depth = depth
    }

    getStartTime() {
        return this.startTime
    }

    toProtocolBuffer() {
        const pSpanEvent = new spanMessages.PSpanEvent()
        pSpanEvent.setSequence(this.sequence)
        pSpanEvent.setDepth(this.depth)
        pSpanEvent.setStartelapsed(this.startElapsedTime)
        pSpanEvent.setEndelapsed(this.elapsedTime)
        pSpanEvent.setServicetype(this.serviceType)
        pSpanEvent.setApiid(this.apiId)

        if (typeof this.exceptionInfo?.pAnnotation === 'function') {
            pSpanEvent.setExceptioninfo(this.exceptionInfo.pAnnotation())
        }

        const pNextEvent = new spanMessages.PNextEvent()
        const pMessageEvent = new spanMessages.PMessageEvent()
        pMessageEvent.setNextspanid(this.nextSpanId)
        pMessageEvent.setEndpoint(this.endPoint)
        pMessageEvent.setDestinationid(this.destinationId)
        pNextEvent.setMessageevent(pMessageEvent)
        pSpanEvent.setNextevent(pNextEvent)

        if (this.asyncId) {
            pSpanEvent.setAsyncevent(this.asyncId.getAsyncId())
        }

        this.annotations.forEach(annotation => {
            pSpanEvent.addAnnotation(annotation.pAnnotation())
        })

        return pSpanEvent
    }
}


class SpanEventBuilder {
    static comparator = (a, b) => a.sequence - b.sequence

    // DefaultCallStack.java: push sequence 0 start value, depth 1 start value
    static nullObject() {
        return new SpanEventBuilder(StackId.nullObject)
    }

    static default() {
        return new SpanEventBuilder(StackId.default)
    }

    static root() {
        return new SpanEventBuilder(StackId.root)
    }

    static make(stackId) {
        if (stackId === StackId.nullObject) {
            return SpanEventBuilder.nullObject()
        }

        if (stackId === StackId.root) {
            return SpanEventBuilder.root()
        }

        if (stackId === StackId.default) {
            return SpanEventBuilder.default()
        }

        return new SpanEventBuilder(stackId)
    }

    constructor(stackId) {
        this.stackId = stackId
        this.annotations = []
        this.startTime = Date.now()
        this.apiId = 0
        this.depth = -1
        this.nextSpanId = '-1'
    }

    needsSequence() {
        return this.stackId !== StackId.nullObject
    }

    needsDepth() {
        return this.stackId !== StackId.nullObject
    }

    setSequence(sequence) {
        this.sequence = sequence
        return this
    }

    setDepth(depth) {
        this.depth = depth
        return this
    }

    getDepth() {
        return this.depth
    }

    getStartTime() {
        return this.startTime
    }

    setServiceType(serviceType) {
        this.serviceType = serviceType
        return this
    }

    getStartElapsedTime() {
        return this.startElapsedTime
    }

    setStartElapsedTime(startElapsedTime) {
        this.startElapsedTime = startElapsedTime
        return this
    }

    addAnnotation(annotation) {
        this.annotations.push(annotation)
        return this
    }

    setApiId(apiId) {
        this.apiId = apiId
        return this
    }

    // WrappedSpanEventRecorder.java: getNextAsyncId
    getAsyncId() {
        return this.asyncId
    }

    setAsyncId(asyncId) {
        this.asyncId = asyncId
        return this
    }

    markAfterTime() {
        this.setAfterTime(Date.now())
        return this
    }

    setAfterTime(afterTime) {
        this.elapsedTime = afterTime - this.startTime
        return this
    }

    setNextSpanId(nextSpanId) {
        this.nextSpanId = nextSpanId
        return this
    }

    setDestinationId(destinationId) {
        this.destinationId = destinationId
        return this
    }

    setEndPoint(endPoint) {
        this.endPoint = endPoint
        return this
    }

    setExceptionInfo(id, message) {
        this.exceptionInfo = new IntStringValue(id, message)
        return this
    }

    build() {
        if (this.stackId === StackId.nullObject) {
            return SpanEvent.nullObject
        }

        if (!this.elapsedTime) {
            this.markAfterTime()
        }

        const spanEvent = new SpanEvent(this.sequence, this.depth)
        spanEvent.startTime = this.startTime
        spanEvent.serviceType = this.serviceType
        spanEvent.annotations = this.annotations
        spanEvent.startElapsedTime = this.startElapsedTime
        spanEvent.apiId = this.apiId
        spanEvent.asyncId = this.asyncId
        spanEvent.elapsedTime = this.elapsedTime
        spanEvent.nextSpanId = this.nextSpanId
        spanEvent.destinationId = this.destinationId
        spanEvent.endPoint = this.endPoint
        spanEvent.exceptionInfo = this.exceptionInfo
        return spanEvent
    }
}

module.exports = SpanEventBuilder