/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder2')
const SpanRecorder = require('./span-recorder2')
const log = require('../../utils/logger')

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

        this.callStack = []
        this.closed = false

        this.spanEventRecorder = SpanEventRecorder.nullObject()
    }

    // DefaultTrace.java: traceBlockEnd
    traceBlockBegin() {
        if (this.closed) {
            return SpanEventRecorder.nullObject()
        }

        // GrpcSpanProcessorV2: postProcess
        const spanEventRecorder = this.spanEventRecorder.makeSequenceAndDepthGrowth()
        this.callStack.push(spanEventRecorder.getSpanEventBuilder())

        return spanEventRecorder
    }

    traceBlockEnd(spanEventRecorder) {
        if (this.closed) {
            return
        }

        const index = this.callStack.findIndex(item => item === spanEventRecorder.getSpanEventBuilder())
        if (index < 0) {
            log.error('SpanEvent does not exist in call-stack', spanEventRecorder.getSpanEventBuilder())
            return
        }

        if (index === this.callStack.length - 1) {
            this.completeSpanEventBuilder(this.callStack.pop())
        } else {
            const spanEvent = this.callStack.slice(index, 1)?.[0]
            this.completeSpanEventBuilder(spanEvent)
        }
    }

    completeSpanEventBuilder(builder) {
        builder?.markElapsedTime()
        this.repository.storeSpanEvent(builder?.build())
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

    canSampled() {
        return true
    }

    close() {
        this.closed = true
        this.repository.storeSpan(this.spanBuilder.build())
    }
}

module.exports = Trace