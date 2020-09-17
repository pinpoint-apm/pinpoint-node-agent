/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const contextManager = require('./context-manager')
const Trace = require('./trace')
const TransactionId = require('./transaction-id')
const TraceId = require('./trace-id')
const IdGenerator = require('./id-generator')
const activeTrace = require('../metric/active-trace')
const log = require('../utils/logger')
const sampler = require('../sampler/sampler')
const DisableTrace = require('./disable-trace')

class TraceContext {
  constructor () {
    this.agentInfo = null
    this.dataSender = null
  }

  static init (options, dataSender, config) {
    if (!options.agentId || !options.applicationName) {
      throw new Error('Fail to initialize pinpoint context')
    }

    contextManager.start()

    const instance = new TraceContext()
    instance.agentInfo = {
      agentId : options.agentId,
      applicationName : options.applicationName,
      agentStartTime : options.agentStartTime,
      serviceType : options.serviceType,
    }
    instance.dataSender = dataSender
    if (config) {
      instance.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
      instance.enableSampling = config.sampling
    }

    return instance
  }

  continueTraceObject (requestData) {
    const traceId = new TraceId(
        requestData.transactionId,
        requestData.spanId,
        requestData.parentSpanId,
        requestData.flag)
    
    return this.createTraceObject(traceId, requestData.sampled, requestData)
  }

  newTraceObject (sampling) {
    const transactionId = new TransactionId(this.agentInfo.agentId,
        this.agentInfo.agentStartTime.toString())
    const spanId = IdGenerator.next
    const traceId = new TraceId(transactionId, spanId.toString())
    return this.createTraceObject(traceId, sampling)
  }

  createTraceObject (traceId, sampling, requestData) {
    if (traceId == null || this.agentInfo == null) {
      return null
    }
    try {
      const trace = new Trace(traceId, this.agentInfo, this.dataSender, sampling, requestData)
      this.setCurrentTraceObject(trace)
      activeTrace.register(trace)
      return trace
    } catch (e) {
      log.error('Fail to create trace object', e)
    }
  }

  completeTraceObject (trace) {
    if (!trace || !trace.spanRecorder || !trace.span) {
      return
    }
    try {
      trace.spanRecorder.span.markElapsedTime()
      trace.close()
      activeTrace.remove(trace)
    } catch (e) {
      log.error('Fail to complete trace object', e)
    }
  }

  currentTraceObject () {
    return contextManager.getObject()
  }

  setCurrentTraceObject (traceObject) {
    contextManager.setObject(traceObject)
  }

  makeTrace(requestData) {
    const transactionId = requestData && requestData.transactionId
    if (transactionId) {
      if (this.enableSampling) {
        return this.continueTraceObject(requestData)
      } else {
        const traceId = new TraceId(
          requestData.transactionId,
          requestData.spanId,
          requestData.parentSpanId,
          requestData.flag)
        const disableTrace = new DisableTrace(traceId, this.agentInfo, requestData)
        this.setCurrentTraceObject(disableTrace)
        return disableTrace
      }
    } else {
      return this.newTraceObject(this.isSampling())
    }
  }

  // only test
  getAllTraceObject () {
    return contextManager.getAllObject()
  }
}

module.exports = {
  init: TraceContext.init
}

