const instManager = require('instrumentation/inst-manager')
const traceContext = require('context/trace-context')
const getConfig = require('config').get

class Agent {
  constructor (agentConfig) {
    this.config = getConfig(agentConfig)
    this.agentId = this.config.agentId
    this.agentStartTime = Date.now()

    this.traceContext = traceContext.init({
      agentId: this.agentId,
      agenStartTime: this.agenStartTime,
    })

    instManager.init(this)
  }

  getTraceObject (traceId) {
    if (traceId) {
      this.traceContext.continueTraceObject(traceId)
    } else {
      this.traceContext.newTraceObject()
    }
  }
}

module.exports = Agent
