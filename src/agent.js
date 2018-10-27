const instManager = require('instrumentation/inst-manager')
const TraceContext = require('context/trace-context')

class Agent {
  constructor () {
    instManager.init(this)
    this.traceContext = new TraceContext().createNew()
  }
}

module.exports = Agent
