/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AsyncTrace = require('../../context/async-trace')
const DisableAsyncTrace = require('../../context/disable-async-trace')
const serviceType = require('./async-service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../constant/default-predefined-method-descriptor-registry')

class TraceBuilder {
    constructor(trace) {
        this.trace = trace
    }

    static valueOfTrace(trace) {
        return new TraceBuilder(trace)
    }

    buildAsyncTrace(asyncId) {
        if (!this.trace || !this.trace.traceId || !this.trace.agentInfo || (typeof this.trace.canSampled === 'function' && !this.trace.canSampled())) {
            return new DisableAsyncTrace()
        }

        const asyncTrace = new AsyncTrace(this.trace.span, asyncId, this.trace.traceId, this.trace.agentInfo, this.trace.dataSender, this.trace.sampling)
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