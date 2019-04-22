'use strict'

const contextManager = require('./context-manager')
const Trace = require('./trace')
const TransactionId = require('./transaction-id')
const TraceId = require('./trace-id')
const IdGenerator = require('./id-generator')
const activeTrace = require('../metric/active-trace')
const BufferedStorage = require('./buffered-storage')
const SpanChunk = require('./span-chunk')
const log = require('../utils/logger')

class TraceContext {
  constructor () {
    this.agentInfo = null
    this.dataSender = null
  }

  static init (options, dataSender) {
    if (!options.agentId || !options.applicationName) {
      throw new Error('Fail to initialize pinpoint context')
    }

    const instance = new TraceContext()
    instance.agentInfo = {
      agentId : options.agentId,
      applicationName : options.applicationName,
      agentStartTime : options.agentStartTime,
      serviceType : options.serviceType,
    }
    instance.dataSender = dataSender
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
        this.agentInfo.agentStartTime)
    const spanId = IdGenerator.next
    const traceId = new TraceId(transactionId, spanId)
    return this.createTraceObject(traceId, sampling)
  }

  createTraceObject (traceId, sampling, requestData) {
    if (traceId == null || this.agentInfo == null) {
      return null
    }
    try {
      const createSpanChunk = SpanChunk.getFactoryMethod(traceId, this.agentInfo)
      const storage = new BufferedStorage(this.dataSender, createSpanChunk)
      const trace = new Trace(traceId, this.agentInfo, storage, sampling, requestData)
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
      // this.dataSender.sendSpan(trace.span)
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

  // only test
  getAllTraceObject () {
    return contextManager.getAllObject()
  }
}

module.exports = {
  init: TraceContext.init
}

