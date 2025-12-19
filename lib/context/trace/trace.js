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
     */
    constructor(spanBuilder, repository, config, sqlMetadataService) {
        this.spanBuilder = spanBuilder
        this.repository = repository
        this.spanRecorder = new SpanRecorder(spanBuilder, config)
        this.sqlMetadataService = sqlMetadataService

        this.callStack = new CallStack(spanBuilder.getTraceRoot())
        this.closed = false
    }

    // DefaultTrace.java: traceBlockEnd
    traceBlockBegin(stackId = StackId.default) {
        if (this.closed) {
            return this.callStack.makeNullSpanEventRecorder(this.sqlMetadataService)
        }

        return this.callStack.makeSpanEventRecorder(stackId, this.sqlMetadataService)
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
        this.spanBuilder.markAfterTime()
        this.repository.storeSpan(this.spanBuilder)
    }
}

module.exports = Trace