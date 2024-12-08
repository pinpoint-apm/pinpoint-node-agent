/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder2')
const TraceRootSpanRecorder = require('./trace-root-span-recorder')
const StackId = require('./stack-id')
const CallStack = require('./call-stack')
const serviceType = require('../../instrumentation/context/async-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')

class ChildTraceBuilder {
    constructor(traceRoot, repository, localAsyncId) {
        this.traceRoot = traceRoot
        this.repository = repository
        this.spanRecorder = new TraceRootSpanRecorder(traceRoot)
        this.localAsyncId = localAsyncId

        this.callStack = new CallStack(traceRoot)
        this.closed = false

        const spanEventRecorder = this.traceBlockBegin(StackId.asyncBeginStackId)
        spanEventRecorder.recordServiceType(serviceType)
        spanEventRecorder.recordApiId(defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.getApiId())
    }

    traceBlockBegin(stackId = StackId.default) {
        if (this.closed) {
            return SpanEventRecorder.nullObject(this.traceRoot)
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

    getTraceRoot() {
        return this.traceRoot
    }

    getTraceId() {
        return this.traceRoot.getTraceId()
    }

    canSampled() {
        return true
    }

    close() {
        const spanEventBuilder = this.callStack.getByStackId(StackId.asyncBeginStackId)
        this.endSpanEventBuilder(spanEventBuilder)
        this.closed = true
        this.repository.flush()
    }
}

module.exports = ChildTraceBuilder