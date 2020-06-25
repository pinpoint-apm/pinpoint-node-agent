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

    this.streamChannelManager = new StreamChannelManager(this.dataSender)
    if (this.dataSender.tcpClient) {
      const activeThreadCount = new ActiveThreadCount(this.dataSender, this.streamChannelManager, this.config.enabledActiveThreadCount)
      const messageHandler = new MessageHandler(this.dataSender, this.streamChannelManager, activeThreadCount)
      this.dataSender.tcpClient.setMessageHandler(messageHandler)
    }
    this.doHandshake()
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