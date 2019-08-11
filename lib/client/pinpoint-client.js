'use strict'

const DataSender = require('./data-sender')
const controlMessageEncoder = require('./control-msessage-encoder')
const CommandType = require('../constant/commaned-type').CommandType
const TypedBuffer = require('../utils/typed-buffer')
const PacketType = require('./packet/packet-type').PacketType
const StreamCreatePacket = require('./packet/stream-create-packet')
const StreamCreateSuccessPacket = require('./packet/stream-create-success-packet')
const log = require('../utils/logger')

class PinpointClient {
  constructor (config, agentInfo) {
    this.config = config
    this.agentInfo = agentInfo

    this.dataSender = new DataSender(this.config)
    this.dataSender.addTcpListener(this.listen(this.dataSender))
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

  sendAgentInfo () {
    this.dataSender.sendAgentInfo(this.agentInfo)
  }

  getDataSender () {
    if (!this.dataSender) {
      this.dataSender = new DataSender(this.config)
    }
    return this.dataSender;
  }

  listen (dataSender) {
    return function(data) {
      if (!data) {
        return null
      }

      const buffer = TypedBuffer.from(data)
      const packetType = buffer.readShort()
      log.info('[TCP] deserialize packet type', packetType)

      if (packetType === PacketType.APPLICATION_STREAM_CREATE) {
        const createPacket = StreamCreatePacket.readBuffer(buffer)
        const successPacket = new StreamCreateSuccessPacket(createPacket.getStreamChannelId())
        dataSender.sendPacket(successPacket)

      }
    }
  }
}

module.exports = PinpointClient
