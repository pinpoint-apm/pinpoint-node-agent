/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder2')
const Trace = require('./trace2')
const TraceRootSpanRecorder = require('./trace-root-span-recorder')
const StackId = require('./stack-id')
const CallStack = require('./call-stack')

class ChildTrace extends Trace {
    constructor(spanBuilder, repository, localAsyncId) {
        super(spanBuilder, repository)
        this.localAsyncId = localAsyncId
    }
}

class ChildTraceBuilder {
    constructor(traceRoot, repository, localAsyncId) {
        this.traceRoot = traceRoot
        this.repository = repository
        this.spanRecorder = new TraceRootSpanRecorder(traceRoot)
        this.localAsyncId = localAsyncId

        this.callStack = new CallStack()
        this.closed = false

        this.traceBlockBegin(StackId.asyncBeginStackId)
    }

    traceBlockBegin(stackId = StackId.default) {
        if (this.closed) {
            return SpanEventRecorder.nullObject()
        }

        return this.callStack.makeSpanEventRecorder(stackId)
    }

    traceBlockEnd() {
        if (this.closed) {
            return
        }

        const spanEventBuilder = this.callStack.pop()
        spanEventBuilder.markAfterTime()
        this.repository.storeSpanEvent(spanEventBuilder)
    }

    getTraceRoot() {
        return this.traceRoot
    }

    getTraceId() {
        return this.traceRoot.getTraceId()
    }

    close() {
        this.traceBlockEnd(StackId.asyncBeginStackId)
        this.closed = true
        this.repository.flush()
    }
}

module.exports = ChildTraceBuilder