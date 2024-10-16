/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Trace = require('./trace')
const TransactionId = require('./transaction-id')
const TraceId = require('./trace-id')
const SpanId = require('./span-id')
const log = require('../utils/logger')
const sampler = require('../sampler/sampler')
const DisableTrace = require('./disable-trace')
const localStorage = require('../instrumentation/context/local-storage')
const TraceRootBuilder = require('./trace-root-builder')
const RemoteTraceRootBuilder = require('./remote-trace-root-builder')
const activeRequestRepository = require('./trace/active-request-repository')
const TraceSampler = require('./trace/trace-sampler')
const SpanBuilder = require('./span-builder')
const SpanChunkBuilder = require('./span-chunk-builder')
const SpanRepository = require('./trace/span-repository')
const SpanRecorder = require('./span-recorder')
const SpanEventRecorderBuilder = require('./trace/span-event-recorder-builder')
const TraceBuilder = require('./trace-builder')

class TraceContext {
  constructor(agentInfo, dataSender, config) {
    this.agentInfo = agentInfo
    this.dataSender = dataSender
    this.config = config
    if (config) {
      this.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
      this.enableSampling = config.sampling
    }
    this.traceSampler = new TraceSampler(config)
    this.localTraceRootBuilder = new TraceRootBuilder(agentInfo.agentId)
  }

  continueTraceObject(requestData) {
    const traceId = new TraceId(
      requestData.transactionId,
      requestData.spanId,
      requestData.parentSpanId,
      requestData.flag)

    return this.createTraceObject(traceId, requestData)
  }

  newTraceObject(sampling) {
    if (!sampling) {
      return new DisableTrace()
    }
    const transactionId = new TransactionId(this.agentInfo.agentId, this.agentInfo.agentStartTime.toString())
    const spanId = SpanId.newSpanId()
    const traceId = new TraceId(transactionId, spanId)
    return this.createTraceObject(traceId)
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/a113e527e73add4e848de9173923b01e06b3cca1/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/ServletRequestListener.java#L117
  createTraceObject(traceId, requestData) {
    if (!traceId || !this.agentInfo) {
      return new DisableTrace()
    }

    try {
      const trace = new Trace(traceId, this.agentInfo, this.dataSender, requestData)
      // activeTrace.register(trace)
      return trace
    } catch (e) {
      log.error('Fail to create trace object', e)
    }
  }

  completeTraceObject(trace) {
    if (!trace) {
      return
    }
    try {
      if (trace.spanRecorder && trace.spanRecorder.span && typeof trace.spanRecorder.span.markElapsedTime === 'function') {
        trace.spanRecorder.span.markElapsedTime()
      }
      trace.close()
      // activeTrace.remove(trace)
    } catch (e) {
      log.error('Fail to complete trace object', e)
    }
  }

  currentTraceObject() {
    return localStorage.getStore()
  }

  makeTrace(requestData) {
    if (requestData && typeof requestData.sampled === 'boolean' && requestData.sampled === false) {
      return new DisableTrace()
    }

    const transactionId = requestData && requestData.transactionId
    if (transactionId) {
      if (this.enableSampling) {
        return this.continueTraceObject(requestData)
      } else {
        return new DisableTrace()
      }
    } else {
      return this.newTraceObject(this.isSampling())
    }
  }

  // disableSampling() method in DefaultBaseTraceFactory.java
  disableSampling() {
    const state = this.traceSampler.getContinueDisabledState()
    return this.newLocalTrace(state.nextId())
  }

  newLocalTrace(nextDisabledId) {
    const traceRoot = this.localTraceRootBuilder.build(nextDisabledId)
    activeRequestRepository.registry(traceRoot)
    return new DisableTrace(traceRoot)
  }

  // newTraceObject method in DefaultBaseTraceFactory.java
  newTraceObject2(urlPath) {
    const state = this.traceSampler.newState(urlPath)
    if (!state.isSampled()) {
      return this.newLocalTrace(state.nextId())
    }

    const traceRoot = new RemoteTraceRootBuilder(this.agentInfo).build(state.nextId())
    const span = new SpanBuilder(traceRoot).build()
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender)

    const spanRecorder = new SpanRecorder(span)
    const spanEventRecorder = new SpanEventRecorderBuilder(traceRoot).build()
    return new TraceBuilder(span, repository, spanRecorder, spanEventRecorder).build()
  }
}

module.exports = TraceContext