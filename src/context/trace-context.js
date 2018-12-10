'use strict'

const contextManager = require('context/context-manager')
const Trace = require('context/trace')
const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

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

  continueTraceObject (traceId) {
    const trace = new Trace(traceId, this.agentInfo)
    this.setCurrentTraceObject(trace)
    return trace
  }

  newTraceObject () {
    const transactionId = new TransactionId(this.agentInfo.agentId, this.agentInfo.agentStartTime)
    const spanId = IdGenerator.next
    const traceId = new TraceId(transactionId, spanId)
    const trace = new Trace(traceId, this.agentInfo)
    this.setCurrentTraceObject(trace)
    return trace
  }

  completeTraceObject (trace) {
    const targetTrace = trace || this.currentTraceObject()
    if (targetTrace) {
      targetTrace.spanRecorder.span.markElapsedTime()
      return targetTrace
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

