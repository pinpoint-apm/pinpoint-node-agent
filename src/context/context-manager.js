const async_hooks = require('async_hooks')
const Context = require('context/context')

class ContextManager {
  constructor () {
    this.contextMap = new Map()
  }

  create() {
    this.currentContext = new Context().create()
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

module.exports = new ContextManager()
