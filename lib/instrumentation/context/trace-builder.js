/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Span = require('../../context/span')
const SpanRecorder = require('../../context/span-recorder')
const SpanChunk = require('../../context/span-chunk')
const BufferedStorage = require('../../context/buffered-storage')
const AsyncTrace = require('../../context/async-trace')
const DisableAsyncTrace = require('../../context/disable-async-trace')
const serviceType = require('./async-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')

class TraceBuilder {
    constructor(traceId, agentInfo, dataSender, sampling) {
        this.traceId = traceId
        this.agentInfo = agentInfo
        this.dataSender = dataSender
        this.sampling = sampling

        this.span = new Span(traceId, agentInfo)
        this.spanRecorder = new SpanRecorder(this.span)

        this.callStack = []
        this.sequence = 0

        const createSpanChunk = SpanChunk.getFactoryMethod(traceId, agentInfo)
        this.storage = new BufferedStorage(dataSender, createSpanChunk)
    }

    static valueOfTrace(trace) {
        const value = new TraceBuilder(trace.traceId, trace.agentInfo, trace.dataSender, trace.sampling)
        value.span = trace.span
        value.spanRecorder = trace.spanRecorder
        value.callStack = trace.callStack
        value.sequence = trace.sequence
        value.storage = trace.storage
        return value
    }

    buildAsyncTrace(asyncId) {
        if (!asyncId) {
            return new DisableAsyncTrace()
        }

        const value = new AsyncTrace(this.span, asyncId, this.traceId, this.agentInfo, this.dataSender, this.sampling)
        const spanEventRecorder = value.traceAsyncBegin()
        spanEventRecorder.recordServiceType(serviceType)
        spanEventRecorder.recordApiId(defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.getApiId())
        spanEventRecorder.spanEvent.endPoint = null
        spanEventRecorder.spanEvent.destinationId = null
        value.storage.storeSpanEvent(spanEventRecorder.spanEvent)
        return value
    }
}

module.exports = TraceBuilder