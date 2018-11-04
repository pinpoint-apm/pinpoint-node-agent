const instManager = require('instrumentation/inst-manager')
const contextManger = require('context/context-manager')
const getConfig = require('config').get

class Agent {
  constructor (config) {
    this.config = getConfig(config)

    this.contextManger = contextManger

    instManager.init(this)
  }

  createNewContext () {
    this.contextManger.create()
  }

  get currentContext () {
    return this.contextManger.currentContext
  }
}

module.exports = Agent
