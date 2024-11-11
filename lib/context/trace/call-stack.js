/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')
const SpanEventRecorder = require('./span-event-recorder2')

/**
 * DefaultCallStack.java in Java agent
 */
class CallStack {
    constructor() {
        this.stack = []
        this.sequence = 0
        this.depth = 0
    }

    makeSpanEventRecorder(stackId) {
        const recorder = new SpanEventRecorder(SpanEventBuilder.make(stackId))
        this.push(recorder.getSpanEventBuilder())
        return recorder
    }

    push(spanEventBuilder) {
        if (spanEventBuilder.needsSequence()) {
            spanEventBuilder.setSequence(this.sequence++)
        }

        if (spanEventBuilder.needsDepth()) {
            spanEventBuilder.setDepth(this.stack.length + 1)
        }

        this.stack.push(spanEventBuilder)
    }

    // pop in java agent
    pop() {
        if (this.stack.length < 1) {
            return SpanEventBuilder.nullObject()
        }
        return this.stack.pop()
    }
}

module.exports = CallStack