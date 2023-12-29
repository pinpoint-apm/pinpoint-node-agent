/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
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
    }

    static valueOfTrace(trace) {
        const value = new TraceBuilder(trace.traceId, trace.agentInfo, trace.dataSender, trace.sampling)
        value.span = trace.span
        value.spanRecorder = trace.spanRecorder
        value.callStack = trace.callStack
        value.sequence = trace.sequence
        return value
    }

    buildAsyncTrace(asyncId) {
        const asyncTrace = new AsyncTrace(this.span, asyncId, this.traceId, this.agentInfo, this.dataSender, this.sampling)
        if (!asyncTrace || !asyncTrace.storage || typeof asyncTrace.storage.storeSpanEvent !== 'function') {
            return new DisableAsyncTrace()
        }

        const spanEventRecorder = asyncTrace.traceAsyncBegin()
        spanEventRecorder.recordServiceType(serviceType)
        spanEventRecorder.recordApiId(defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.getApiId())
        spanEventRecorder.recordEndPoint(null)
        spanEventRecorder.recordDestinationId(null)

        asyncTrace.rootAsyncSpanEventRecorder = spanEventRecorder
        return asyncTrace
    }
}

module.exports = TraceBuilder