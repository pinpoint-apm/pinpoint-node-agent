const contextManager = require('context/context-manager')
const Trace = require('context/trace')
const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

class TraceContext {
  constructor () {
    this.agentId = null
    this.agentStartTime = null
  }

  static init (options) {
    const instance = new TraceContext()
    options.agentId && (instance.agentId = options.agentId)
    options.agentStartTime && (instance.agentStartTime = options.agentStartTime)
    return instance
  }

  continueTraceObject (traceId) {
    const trace = new Trace(traceId)
    this.setCurrentTraceObject(trace)
    return trace
  }

  newTraceObject () {
    const transactionId = new TransactionId(this.agentId, this.agentStartTime)
    const spanId = IdGenerator.next
    const traceId = new TraceId(transactionId, spanId)
    const trace = new Trace(traceId)
    this.setCurrentTraceObject(trace)
    return trace
  }

  completeTraceObject () {
    const trace = this.currentTraceObject()
    trace.spanRecorder.span.markElapsedTime()
    return trace;
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

