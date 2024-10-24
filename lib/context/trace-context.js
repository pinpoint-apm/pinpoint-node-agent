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
const activeRequestRepository = require('./trace/active-request-repository')
const TraceSampler = require('./trace/trace-sampler')
const SpanBuilder = require('./span-builder')
const SpanChunkBuilder = require('./span-chunk-builder')
const SpanRepository = require('./trace/span-repository')
const Trace2 = require('./trace/trace2')

class TraceContext {
  constructor(agentInfo, dataSender, config) {
    this.agentInfo = agentInfo
    this.dataSender = dataSender
    this.config = config
    if (config) {
      this.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
      this.enableSampling = config.sampling
    }
    this.traceSampler = new TraceSampler(agentInfo, config)
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
    const traceRoot = this.traceSampler.makeContinueDisableTraceRoot()
    return this.newLocalTrace(traceRoot)
  }

  newLocalTrace(traceRoot) {
    activeRequestRepository.registry(traceRoot)
    return new DisableTrace(traceRoot)
  }

  // newTraceObject method in DefaultBaseTraceFactory.java
  newTraceObject2(urlPath) {
    const traceRoot = this.traceSampler.makeNewTraceRoot(urlPath)
    if (!traceRoot.isSampled()) {
      return this.newLocalTrace(traceRoot)
    }

    const spanBuilder = new SpanBuilder(traceRoot)
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender)
    return new Trace2(spanBuilder, repository, this.agentInfo.getServiceType())
  }

  // DefaultAsyncContext.java: newAsyncContextTrace
  // DefaultBaseTraceFactory.java: continueAsyncContextTraceObject
  continueAsyncContextTraceObject(traceRoot, asyncId) {
    const localAsyncId = asyncId.nextLocalAsyncId2()
    
  }
}

module.exports = TraceContext