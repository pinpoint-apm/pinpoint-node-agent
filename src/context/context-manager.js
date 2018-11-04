const async_hooks = require('async_hooks')
const Context = require('context/context')
const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

class ContextManager {
  constructor () {
    this.contextMap = new Map()
    this.agentId = null
    this.agentStartTime = null
  }

  static create (options) {
    const instance = new ContextManager()
    options.agentId && (instance.agentId = options.agentId)
    options.agentStartTime && (instance.agentStartTime = options.agentStartTime)
    return instance
  }

  createNewContext (traceId) {
    if (!traceId) {
      const transactionId = new TransactionId(this.agentId, this.agentStartTime)
      const spanId = IdGenerator.next
      traceId = new TraceId(transactionId, spanId)
    }
    this.currentContext = new Context(traceId)
    return this.currentContext
  }

  get currentContext () {
    const contextId = async_hooks.executionAsyncId()
    console.log('getter context id : ' + contextId)
    return this.contextMap.has(contextId) ? this.contextMap.get(contextId) : null
  }

  set currentContext (_context) {
    const contextId = async_hooks.executionAsyncId()
    console.log('setter context id : ' + contextId)
    this.contextMap.set(contextId, _context)
  }

  getContextCount() {
    return this.contextMap.size
  }
}

module.exports = {
  create: ContextManager.create
}

