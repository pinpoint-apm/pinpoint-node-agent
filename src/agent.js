const instManager = require('instrumentation/inst-manager')
const contextManger = require('context/context-manager')
const getConfig = require('config').get

class Agent {
  constructor (agentConfig) {
    this.config = getConfig(agentConfig)
    this.agentId = this.config.agentId
    this.agentStartTime = Date.now()

    this.contextManger = contextManger.create({
      agentId: this.agentId,
      agenStartTime: this.agenStartTime,
    })

    instManager.init(this)
  }

  createNewContext () {
    this.contextManger.createNewContext()
  }

  get currentContext () {
    return this.contextManger.currentContext
  }
}

module.exports = Agent
