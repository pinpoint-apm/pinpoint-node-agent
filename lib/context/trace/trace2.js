/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder2')
const SpanRecorder = require('./span-recorder2')
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
    constructor(spanBuilder, repository) {
        this.spanBuilder = spanBuilder
        this.repository = repository
        this.spanRecorder = new SpanRecorder(spanBuilder)

        this.callStack = new CallStack()
        this.closed = false
    }

    // DefaultTrace.java: traceBlockEnd
    traceBlockBegin(stackId = StackId.default) {
        if (this.closed) {
            return SpanEventRecorder.nullObject()
        }

        // GrpcSpanProcessorV2: postProcess
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

    recordServiceType(serviceType) {
        this.spanRecorder.recordServiceType(serviceType)
    }

    recordApi(methodDescriptor) {
        this.spanRecorder.recordApi(methodDescriptor)
    }

    recordRpc(pathName) {
        this.spanRecorder.recordRpc(pathName)
    }

    recordEndPoint(endPoint) {
        this.spanRecorder.recordEndPoint(endPoint)
    }

    recordRemoteAddress(remoteAddress) {
        this.spanRecorder.recordRemoteAddress(remoteAddress)
    }

    recordAcceptorHost(host) {
        this.spanRecorder.recordAcceptorHost(host)
    }

    getTraceId() {
        return this.spanBuilder.getTraceRoot().getTraceId()
    }

    getTraceRoot() {
        return this.spanBuilder.getTraceRoot()
    }

    canSampled() {
        return true
    }

    close() {
        this.traceBlockEnd()
        this.closed = true
        this.repository.storeSpan(this.spanBuilder.build())
    }
}

module.exports = Trace