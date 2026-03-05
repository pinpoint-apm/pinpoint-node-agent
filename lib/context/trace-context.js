/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/log/logger')
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
const { SqlMetadataService } = require('../instrumentation/sql/sql-metadata-service')
const SpanRecorder = require('./trace/span-recorder')
const DisableSpanRecorder = require('./disable-span-recorder')

class TraceContext {
  constructor(agentInfo, dataSender, config, enrichers = []) {
    this.agentInfo = agentInfo
    this.dataSender = dataSender
    this.config = config
    this.traceSampler = new TraceSampler(agentInfo, config)
    this.sqlMetadataService = new SqlMetadataService(dataSender, config)
    this.traceCompletionEnrichers = enrichers.filter(e => typeof e.onComplete === 'function')
    this.spanRecorderEnricher = enrichers.find(e => typeof e.record === 'function')
  }

  getAgentInfo() {
    return this.agentInfo
  }

  getConfig() {
    return this.config
  }

  completeTraceObject(trace) {
    if (!trace) {
      return
    }

    try {
      const traceCloseTime = trace.close()
      for (const enricher of this.traceCompletionEnrichers) {
        try {
          enricher.onComplete(trace, traceCloseTime)
        } catch (e) {
          log.error('enricher failed', e)
        }
      }

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
    const spanRecorder = new DisableSpanRecorder()
    if (this.spanRecorderEnricher) {
      spanRecorder.enricher = this.spanRecorderEnricher
    }
    return new DisableTrace(traceRoot, spanRecorder)
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/a113e527e73add4e848de9173923b01e06b3cca1/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/ServletRequestListener.java#L117
  // newTraceObject method in DefaultBaseTraceFactory.java
  newTraceObject(urlPath) {
    const traceRoot = this.traceSampler.makeNewTraceRoot(urlPath)
    if (!traceRoot.isSampled()) {
      return this.newLocalTrace(traceRoot)
    }

    return this.newTrace(traceRoot)
  }

  // newTraceObject method in DefaultBaseTraceFactory.java
  newTrace(traceRoot) {
    const spanBuilder = new SpanBuilder(traceRoot)
      .setApplicationServiceType(this.agentInfo.getApplicationServiceType())
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
      .setApplicationServiceType(this.agentInfo.getApplicationServiceType())
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender)
    activeRequestRepository.register(traceRoot)
    const spanRecorder = new SpanRecorder(spanBuilder, this.config)
    if (this.spanRecorderEnricher) {
      spanRecorder.enricher = this.spanRecorderEnricher
    }
    return new Trace(spanBuilder, repository, spanRecorder, this.sqlMetadataService)
  }

  // DefaultAsyncContext.java: newAsyncContextTrace
  // DefaultBaseTraceFactory.java: continueAsyncContextTraceObject
  // AsyncContextSpanEventEndPointApiAwareInterceptor.java : before
  continueAsyncContextTraceObject(traceRoot, localAsyncId) {
    if (localAsyncId === disableAsyncId) {
      return this.continueDisableAsyncContextTraceObject(traceRoot)
    }

    const spanChunkBuilder = new AsyncSpanChunkBuilder(traceRoot, localAsyncId)
      .setApplicationServiceType(this.agentInfo.getApplicationServiceType())
    const repository = new SpanRepository(spanChunkBuilder, this.dataSender)
    return new ChildTraceBuilder(traceRoot, repository, localAsyncId, this.sqlMetadataService)
  }

  // DefaultBaseTraceFactory.java: continueDisableAsyncContextTraceObject
  continueDisableAsyncContextTraceObject(traceRoot) {
    return new DisableChildTrace(traceRoot)
  }

  // DefaultBaseTraceFactory.java: continueTraceObject
  continueTraceObject(traceId) {
    const traceRoot = this.traceSampler.makeContinueTraceRoot(traceId)
    return this.newTrace(traceRoot)
  }
}

module.exports = TraceContext