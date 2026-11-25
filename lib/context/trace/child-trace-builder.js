/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceRootSpanRecorder = require('./trace-root-span-recorder')
const StackId = require('./stack-id')
const CallStack = require('./call-stack')
const serviceType = require('../../instrumentation/context/async-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')

class ChildTraceBuilder {
    constructor(traceRoot, repository, localAsyncId, spanEventRecorderFactory, exceptionRecorder) {
        this.traceRoot = traceRoot
        this.repository = repository
        this.spanRecorder = new TraceRootSpanRecorder(traceRoot)
        this.localAsyncId = localAsyncId
        this.exceptionRecorder = exceptionRecorder

        this.callStack = new CallStack(traceRoot, spanEventRecorderFactory, exceptionRecorder)
        this.closed = false

        this.asyncSpanEventRecorder = this.traceBlockBegin(StackId.asyncBeginStackId)
        this.asyncSpanEventRecorder.recordServiceType(serviceType)
        this.asyncSpanEventRecorder.recordApiId(defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.getApiId())
    }

    getAsyncSpanEventRecorder() {
        return this.asyncSpanEventRecorder
    }

    // ChildTrace.java: getSpanRecorder
    getSpanRecorder() {
        return this.spanRecorder
    }

    traceBlockBegin(stackId = StackId.default) {
        return this.callStack.makeSpanEventRecorder(stackId)
    }

    traceBlockEnd(spanEventRecorder) {
        this.endSpanEventBuilder(spanEventRecorder.getSpanEventBuilder())
        if (this.closed) {
            this.exceptionRecorder.close()
            this.repository.flush()
        }
    }

    endSpanEventBuilder(builder) {
        const spanEventBuilder = this.callStack.pop(builder)
        spanEventBuilder?.markAfterTime()
        this.repository.storeSpanEvent(spanEventBuilder)
    }

    getTraceRoot() {
        return this.traceRoot
    }

    getTraceId() {
        return this.traceRoot.getTraceId()
    }

    canSampled() {
        return true
    }

    // The Asynchronous Invocation stays in the call stack, so a span event that begins after close is still one level below it.
    close() {
        if (this.closed) {
            return
        }
        const spanEventBuilder = this.callStack.getByStackId(StackId.asyncBeginStackId)
        spanEventBuilder.markAfterTime()
        this.repository.storeSpanEvent(spanEventBuilder)
        this.closed = true
        this.exceptionRecorder.close()
        this.repository.flush()
    }
}

module.exports = ChildTraceBuilder