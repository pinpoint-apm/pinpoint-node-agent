/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SpanEvent {
    constructor(sequence) {
        this.sequence = sequence
    }
}

class SpanEventBuilder {
    // DefaultCallStack.java: push sequence 0 start value, depth 1 start value
    static nullObject() {
        return new SpanEventBuilder(-1, 0)
    }

    constructor(sequence, depth) {
        this.sequence = sequence
        this.depth = depth
        this.annotations = []
        this.startTime = Date.now()
    }

    markElapsedTime() {
        this.elapsedTime = Date.now() - this.startTime
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

    setAsyncId(asyncId) {
        this.asyncId = asyncId
        return this
    }

    makeSequenceAndDepthGrowth() {
        return new SpanEventBuilder(this.sequence + 1, this.depth + 1)
    }

    build() {
        const spanEvent = new SpanEvent(this.sequence)
        spanEvent.apiId = this.apiId
        spanEvent.depth = this.depth
        spanEvent.annotations = this.annotations
        spanEvent.startTime = this.startTime
        spanEvent.elapsedTime = this.elapsedTime
        spanEvent.asyncId = this.asyncId
        return spanEvent
    }
}

module.exports = SpanEventBuilder