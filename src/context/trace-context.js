'use strict'

const contextManager = require('./context-manager')
const Trace = require('./trace')
const TransactionId = require('./transaction-id')
const TraceId = require('./trace-id')
const IdGenerator = require('./id-generator')
const activeTrace = require('../metric/active-trace')
const log = require('../utils/logger')

class TraceContext {
  constructor () {
    this.agentInfo = null
  }

  static init (options) {
    if (!options.agentId || !options.applicationName) {
      throw new Error()
    }

    const instance = new TraceContext()
    instance.agentInfo = {
      agentId : options.agentId,
      applicationName : options.applicationName,
      agentStartTime : options.agentStartTime,
      serviceType : options.serviceType,
    }
    return instance
  }

  continueTraceObject (requestData) {
    const traceId = new TraceId(requestData.transactionId, requestData.spanId, requestData.parentSpanId, requestData.flag)
    return this.createTraceObject(traceId, requestData.sampled, requestData)
  }

  newTraceObject (sampling) {
    const transactionId = new TransactionId(this.agentInfo.agentId, this.agentInfo.agentStartTime)
    const spanId = IdGenerator.next
    const traceId = new TraceId(transactionId, spanId)
    return this.createTraceObject(traceId, sampling)
  }

  createTraceObject (traceId, sampling, requestData) {
    const trace = new Trace(traceId, this.agentInfo, sampling, requestData)
    this.setCurrentTraceObject(trace)
    activeTrace.register(trace)
    return trace
  }

  completeTraceObject (trace) {
    if (trace) {
      trace.spanRecorder.span.markElapsedTime()
      activeTrace.remove(trace)
      return trace
    }
  }

  currentTraceObject () {
    return contextManager.getObject()
  }

  setCurrentTraceObject (traceObject) {
    contextManager.setObject(traceObject)
  }

  getAllTraceObject () {
    return contextManager.getAllObject()
  }
}

module.exports = {
  init: TraceContext.init
}

