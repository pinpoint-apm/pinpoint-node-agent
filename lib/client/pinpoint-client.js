'use strict'

const DataSender = require('./data-sender')
const controlMessageEncoder = require('./control-msessage-encoder')

class PinpointClient {
  constructor (config, agentInfo) {
    this.config = config
    this.agentInfo = agentInfo

    this.dataSender = new DataSender(this.config)
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
      supportCommandList: [710, 730],
    }

    const encodedHandshakeParams = controlMessageEncoder.encode(this.handshakeParams)
    this.dataSender.sendControlHandshake(encodedHandshakeParams)
  }

  sendPing () {
    this.dataSender.sendPing()
  }

  sendAgentInfo () {
    this.dataSender.sendAgentInfo(this.agentInfo)
  }

  getDataSender () {
    if (!this.dataSender) {
      this.dataSender = new DataSender(this.config)
    }
    return this.dataSender;
  }
}

module.exports = PinpointClient
