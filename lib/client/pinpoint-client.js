'use strict'

const controlMessageEncoder = require('./control-msessage-encoder')
const CommandType = require('../constant/commaned-type').CommandType
const MessageHandler = require('./message-handler')
const StreamChannelManager = require('./stream-channel-manager')
const ActiveThreadCount = require('../metric/active-thread-count')
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