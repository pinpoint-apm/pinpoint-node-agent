const instManager = require('instrumentation/inst-manager')
const contextManger = require('context/context-manager')

class Agent {
  constructor () {
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
