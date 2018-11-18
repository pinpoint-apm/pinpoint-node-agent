const async_hooks = require('async_hooks')
const Trace = require('context/trace')
const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

class TraceContext {
  constructor () {
    this.traceObjectMap = new Map()
    this.agentId = null
    this.agentStartTime = null
  }

  static init (options) {
    async_hooks.createHook({ init(){} }).enable();

    const instance = new TraceContext()
    options.agentId && (instance.agentId = options.agentId)
    options.agentStartTime && (instance.agentStartTime = options.agentStartTime)
    return instance
  }

  static getContextId () {
    console.log('triggerAsyncId : ', async_hooks.triggerAsyncId())
    return async_hooks.executionAsyncId()
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

  currentTraceObject () {
    const contextId = TraceContext.getContextId()
    console.log('getter context id : ' + contextId)
    return this.traceObjectMap.has(contextId) ? this.traceObjectMap.get(contextId) : null
  }

  setCurrentTraceObject (traceObject) {
    console.log('setter context id : ' + TraceContext.getContextId())
    this.traceObjectMap.set(TraceContext.getContextId(), traceObject)
  }

  getTraceObjectCount() {
    return this.traceObjectMap.size
  }
}

module.exports = {
  init: TraceContext.init
}

