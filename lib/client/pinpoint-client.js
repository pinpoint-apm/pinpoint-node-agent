'use strict'

class PinpointClient {
  constructor (config, agentInfo, dataSender) {
    this.config = config
    this.agentInfo = agentInfo
    this.dataSender = dataSender
  }
}

module.exports = PinpointClient
