/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')
const SpanEventRecorder = require('./span-event-recorder')

/**
 * DefaultCallStack.java in Java agent
 */
class CallStack {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.stack = []
        this.sequence = 0
        this.depth = 1
    }

    makeSpanEventRecorder(stackId, sqlMetadataService) {
        const recorder = new SpanEventRecorder(SpanEventBuilder.make(stackId), this.traceRoot, sqlMetadataService)
        this.push(recorder.getSpanEventBuilder())
        return recorder
    }

    push(spanEventBuilder) {
        if (spanEventBuilder.needsSequence()) {
            spanEventBuilder.setSequence(this.sequence++)
        }

        if (spanEventBuilder.needsDepth()) {
            spanEventBuilder.setDepth(this.depth++)
        }

        this.stack.push(spanEventBuilder)
    }

    makeNullSpanEventRecorder() {
        return SpanEventRecorder.nullObject(this.traceRoot)
    }

    // pop in java agent
    pop(builder) {
        const index = this.stack.findIndex(item => item === builder)
        if (index < 0) {
            return
        }

        this.depth--
        if (index < this.stack.length - 1) {
            return this.stack.splice(index, 1)[0]
        }
        return this.stack.pop()
    }

    getByStackId(stackId) {
        return this.stack.find(item => item.stackId === stackId)
    }
}

module.exports = CallStack