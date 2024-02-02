/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Trace = require('./trace')
const TransactionId = require('./transaction-id')
const TraceId = require('./trace-id')
const IdGenerator = require('./id-generator')
const activeTrace = require('../metric/active-trace')
const log = require('../utils/logger')
const sampler = require('../sampler/sampler')
const DisableTrace = require('./disable-trace')
const localStorage = require('../instrumentation/context/local-storage')

class TraceContext {
  constructor() {
    this.agentInfo = null
    this.dataSender = null
  }

  /**
   * trace context singleton instance
   * @param {string} options 
   * @param {string} dataSender 
   * @param {string} config 
   * @returns {TraceContext}
   * @constructor
   */
  static init(options, dataSender, config) {
    if (!options.agentId || !options.applicationName) {
      throw new Error('Fail to initialize pinpoint context')
    }

    const instance = new TraceContext()
    instance.agentInfo = {
      agentId: options.agentId,
      applicationName: options.applicationName,
      agentStartTime: options.agentStartTime,
      serviceType: options.serviceType,
    }
    instance.dataSender = dataSender
    if (config) {
      instance.isSampling = sampler.getIsSampling(config.sampling, config.sampleRate)
      instance.enableSampling = config.sampling
    }

    return instance
  }

  continueTraceObject(requestData) {
    const traceId = new TraceId(
      requestData.transactionId,
      requestData.spanId,
      requestData.parentSpanId,
      requestData.flag)

    return this.createTraceObject(traceId, requestData.sampled, requestData)
  }

  newTraceObject(sampling) {
    if (!sampling) {
      return new DisableTrace()
    }
    const transactionId = new TransactionId(this.agentInfo.agentId, this.agentInfo.agentStartTime.toString())
    const spanId = IdGenerator.stringValueOfNext()
    const traceId = new TraceId(transactionId, spanId)
    return this.createTraceObject(traceId, sampling)
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/a113e527e73add4e848de9173923b01e06b3cca1/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/ServletRequestListener.java#L117
  createTraceObject(traceId, sampling, requestData) {
    if (!traceId || !this.agentInfo || !sampling) {
      return new DisableTrace()
    }

    try {
      const trace = new Trace(traceId, this.agentInfo, this.dataSender, sampling, requestData)
      activeTrace.register(trace)
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
      activeTrace.remove(trace)
    } catch (e) {
      log.error('Fail to complete trace object', e)
    }
  }

  currentTraceObject() {
    return localStorage.getStore()
  }

  makeTrace(requestData) {
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
}

module.exports = TraceContext
