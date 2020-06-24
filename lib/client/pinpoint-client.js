'use strict'

class PinpointClient {
  constructor (config, agentInfo, dataSender) {
    this.config = config
    this.agentInfo = agentInfo
    this.dataSender = dataSender

    this.streamChannelManager = new StreamChannelManager(this.dataSender)
    if (this.dataSender.tcpClient) {
      const activeThreadCount = new ActiveThreadCount(this.dataSender, this.streamChannelManager, this.config.enabledActiveThreadCount)
      const messageHandler = new MessageHandler(this.dataSender, this.streamChannelManager, activeThreadCount)
      this.dataSender.tcpClient.setMessageHandler(messageHandler)
    }
    this.doHandshake(this.agentInfo)
  }

  doHandshake (agentInfo) {
    this.handshakeParams = {
      agentId: agentInfo.agentId,
      applicationName: agentInfo.applicationName,
      startTimestamp: agentInfo.startTimestamp,
      ip: agentInfo.ip,
      hostName: agentInfo.hostname,
      serviceType: agentInfo.serviceType,
      pid: agentInfo.pid,
      version: agentInfo.agentVersion,
      socketId: 1,
      supportServer: true,
      supportCommandList: [CommandType.ECHO, CommandType.ACTIVE_THREAD_COUNT, CommandType.ACTIVE_THREAD_COUNT_RESPONSE],
    }

    const encodedHandshakeParams = controlMessageEncoder.encode(this.handshakeParams)
    this.dataSender.sendControlHandshake(encodedHandshakeParams)
  }

  sendPing () {
    this.dataSender.sendPing()
  }
}

module.exports = PinpointClient
