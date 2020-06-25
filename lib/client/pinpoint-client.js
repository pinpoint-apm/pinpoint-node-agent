'use strict'

const CommandType = require('../constant/commaned-type').CommandType
const log = require('../utils/logger')

class PinpointClient {
  constructor(config, agentInfo, dataSender) {
    this.config = config
    this.agentInfo = agentInfo
    this.dataSender = dataSender
  }

  doHandshake() {
    this.handshakeParams = {
      supportCommandList: [CommandType.ECHO, CommandType.ACTIVE_THREAD_COUNT, CommandType.ACTIVE_THREAD_COUNT_RESPONSE],
    }
    this.dataSender.sendControlHandshake(this.handshakeParams)
  }

  sendPing() {
    this.dataSender.sendPing()
  }
}

module.exports = PinpointClient