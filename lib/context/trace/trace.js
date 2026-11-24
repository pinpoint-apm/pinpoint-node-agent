/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanRecorder = require('./span-recorder')
const CallStack = require('./call-stack')
const StackId = require('./stack-id')

class Trace {
    /**
     * Creates an instance of the Trace class.
     *
     * @constructor
     * @param {SpanBuilder} spanBuilder - The builder for creating spans.
     * @param {Repository} repository - The repository for storing trace data.
     * @param {SpanRecorder} spanRecorder - The recorder for root span attributes.
     * @param {SpanEventRecorderFactory} spanEventRecorderFactory - Factory for creating span event recorders.
     * @param {ExceptionRecorder} exceptionRecorder - The recorder for the exceptions of this trace.
     */
    constructor(spanBuilder, repository, spanRecorder, spanEventRecorderFactory, exceptionRecorder) {
        this.spanBuilder = spanBuilder
        this.repository = repository
        this.spanRecorder = spanRecorder
        this.exceptionRecorder = exceptionRecorder

        this.callStack = new CallStack(spanBuilder.getTraceRoot(), spanEventRecorderFactory, exceptionRecorder)
        this.closed = false
    }

    // DefaultTrace.java: traceBlockEnd
    traceBlockBegin(stackId = StackId.default) {
        if (this.closed) {
            return this.callStack.makeNullSpanEventRecorder()
        }

        return this.callStack.makeSpanEventRecorder(stackId)
    }

    traceBlockEnd(spanEventRecorder) {
        if (this.closed) {
            return
        }

        this.endSpanEventBuilder(spanEventRecorder.getSpanEventBuilder())
    }

    endSpanEventBuilder(builder) {
        const spanEventBuilder = this.callStack.pop(builder)
        spanEventBuilder?.markAfterTime()
        this.repository.storeSpanEvent(spanEventBuilder)
    }

    getSpanRecorder() {
        return this.spanRecorder
    }

    getTraceRoot() {
        return this.spanBuilder.getTraceRoot()
    }

    getTraceId() {
        return this.spanBuilder.getTraceRoot().getTraceId()
    }

    canSampled() {
        return true
    }

    close() {
        this.closed = true

        const afterTime = Date.now()
        this.spanBuilder.markAfterTime(afterTime)
        this.exceptionRecorder.close()
        this.repository.storeSpan(this.spanBuilder)
        return afterTime
    }
}

module.exports = Trace