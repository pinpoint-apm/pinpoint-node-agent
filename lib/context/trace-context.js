/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/logger')
const sampler = require('../sampler/sampler')
const DisableTrace = require('./disable-trace')
const localStorage = require('../instrumentation/context/local-storage')
const TraceSampler = require('./trace/trace-sampler')
const SpanBuilder = require('./span-builder')
const SpanChunkBuilder = require('./span-chunk-builder')
const SpanRepository = require('./trace/span-repository')
const Trace = require('./trace/trace')
const AsyncSpanChunkBuilder = require('./trace/async-span-chunk-builder')
const ChildTraceBuilder = require('./trace/child-trace-builder')
const DisableChildTrace = require('./trace/disable-child-trace')
const disableAsyncId = require('./trace/disable-async-id')
const activeRequestRepository = require('../metric/active-request-repository')

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

  getAgentInfo() {
    return this.agentInfo
  }

  completeTraceObject(trace) {
    if (!trace) {
      return
    }

    try {
      trace.close()
      activeRequestRepository.remove(trace.getTraceRoot())
    } catch (e) {
      log.error('Fail to complete trace object', e)
    }
  }

  currentTraceObject() {
    return localStorage.getStore()
  }

  // disableSampling() method in DefaultBaseTraceFactory.java
  disableSampling() {
    const traceRoot = this.traceSampler.makeContinueDisableTraceRoot()
    return this.newLocalTrace(traceRoot)
  }

  newLocalTrace(traceRoot) {
    activeRequestRepository.register(traceRoot)
    return new DisableTrace(traceRoot)
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/a113e527e73add4e848de9173923b01e06b3cca1/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/ServletRequestListener.java#L117
  // newTraceObject method in DefaultBaseTraceFactory.java
  newTraceObject2(urlPath) {
    const traceRoot = this.traceSampler.makeNewTraceRoot(urlPath)
    if (!traceRoot.isSampled()) {
      return this.newLocalTrace(traceRoot)
    }

    return this.newTrace(traceRoot)
  }

  // newTraceObject method in DefaultBaseTraceFactory.java
  newTrace(traceRoot) {
    const spanBuilder = new SpanBuilder(traceRoot)
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender, this.agentInfo)
    activeRequestRepository.register(traceRoot)
    return new Trace(spanBuilder, repository)
  }

  // DefaultAsyncContext.java: newAsyncContextTrace
  // DefaultBaseTraceFactory.java: continueAsyncContextTraceObject
  // AsyncContextSpanEventEndPointApiAwareInterceptor.java : before
  continueAsyncContextTraceObject(traceRoot, localAsyncId) {
    if (localAsyncId === disableAsyncId) {
      return this.continueDisableAsyncContextTraceObject(traceRoot)
    }

    const spanChunkBuilder = new AsyncSpanChunkBuilder(traceRoot, localAsyncId)
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender, this.agentInfo)
    return new ChildTraceBuilder(traceRoot, repository, localAsyncId)
  }

  // DefaultBaseTraceFactory.java: continueDisableAsyncContextTraceObject
  continueDisableAsyncContextTraceObject(traceRoot) {
    return new DisableChildTrace(traceRoot)
  }

  // DefaultBaseTraceFactory.java: continueTraceObject
  continueTraceObject2(traceId) {
    const traceRoot = this.traceSampler.makeContinueTraceRoot(traceId)
    return this.newTrace(traceRoot)
  }
}

module.exports = TraceContext