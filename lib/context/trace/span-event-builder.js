/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const StackId = require('./stack-id')
const AsyncId = require('../async-id')

class SpanEvent {
    static nullObject = new SpanEvent(0, 0)

    constructor(sequence, depth) {
        this.sequence = sequence
        this.depth = depth
    }
}


class SpanEventBuilder {
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

    setServiceType(serviceType) {
        this.serviceType = serviceType
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
        if (!this.asyncId) {
            this.asyncId = AsyncId.make()
        }
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

    build() {
        if (this.stackId === nullObjectStackId) {
            return SpanEvent.nullObject
        }

        if (!this.elapsedTime) {
            this.markAfterTime()
        }

        const spanEvent = new SpanEvent(this.sequence, this.depth)
        spanEvent.startTime = this.startTime
        spanEvent.serviceType = this.serviceType
        spanEvent.annotations = this.annotations
        spanEvent.apiId = this.apiId
        spanEvent.asyncId = this.asyncId
        spanEvent.elapsedTime = this.elapsedTime
        spanEvent.nextSpanId = this.nextSpanId
        spanEvent.destinationId = this.destinationId
        return spanEvent
    }
}

module.exports = SpanEventBuilder