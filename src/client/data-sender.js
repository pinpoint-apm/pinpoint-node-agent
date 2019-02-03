'use strict'

const TcpClient = require('./tcp-client')
const UdpClient = require('./udp-client')
const serialize = require('../data/serializer').serialize
const SendPacket = require('./packet/send-packet')
const RequestPacket = require('./packet/request-packet')
const PingPacket = require('./packet/ping-packet')
const ControlHandshakePacket = require('./packet/control-handshake-packet')
const dataConvertor = require('../data/data-convertor')
const log = require('../utils/logger')
const SocketStateCode = require('../constant/socket-state-code').SocketStateCode
const pingIdGenerator = require('../context/sequence-generator').pingIdGenerator

class DataSender {
  constructor (config) {
    if (!config) {
      throw new Error()
    }
    this.collectorIp = config.collectorIp
    this.collectorTcpPort = config.collectorTcpPort
    this.collectorStatPort = config.collectorStatPort
    this.collectorSpanPort = config.collectorSpanPort

    this.enabledDataSending = config.enabledDataSending

    this.tcpClient = new TcpClient(this.collectorIp, this.collectorTcpPort)

    if (this.tcpClient) {
      this.socketStateCode = SocketStateCode.RUN_WITHOUT_HANDSHAKE
    }

    this.spanUdpClient = new UdpClient(this.collectorIp, this.collectorSpanPort)
    this.statUdpClient = new UdpClient(this.collectorIp, this.collectorStatPort)
  }

  sendAgentInfo (agentInfo) {
    if (agentInfo && this.enabledDataSending) {
      const tAgentInfo = dataConvertor.convertTAgentInfo(agentInfo)
      log.debug('send AgentInfo \n ', tAgentInfo)
      const packet = new SendPacket(serialize(tAgentInfo))
      this.tcpClient.send(packet.toBuffer())
    }
  }

  sendStringMetaInfo (stringMetaInfo) {
    const tStringMetaData = dataConvertor.convertTStringMetaData(stringMetaInfo)
    this.sendMetaInfo(tStringMetaData)
  }

  sendApiMetaInfo (apiMetaInfo) {
    const tStringMetaData = dataConvertor.convertTApiMetaData()
    this.sendMetaInfo(tStringMetaData)
  }

  sendMetaInfo (tMetaInfo) {
    if (tMetaInfo && this.enabledDataSending) {
      log.debug('send MetaInfo \n ', tMetaInfo)
      const packet = new RequestPacket(tMetaInfo.apiId, serialize(tMetaInfo))
      this.tcpClient.send(packet.toBuffer())
    }
  }

  sendControlHandshake (params) {
    if (this.enabledDataSending) {
      log.debug('send Handshake \n ')
      const packet = new ControlHandshakePacket(0, params)
      this.tcpClient.send(packet.toBuffer())
    }
  }

  sendPing () {
    if (this.enabledDataSending) {
      log.debug('send Ping \n ')
      const packet = new PingPacket(pingIdGenerator.next, 0, this.socketStateCode)
      this.tcpClient.send(packet.toBuffer())
    }
  }

  sendSpan (span) {
    if (span && this.enabledDataSending) {
      const tSpan = dataConvertor.convertTSpan(span)
      log.debug('send Span \n ', tSpan)
      const packet = serialize(tSpan)
      this.spanUdpClient.send(packet)
    }
  }

  sendStats (stats) {
    if (stats && this.enabledDataSending) {
      const tAgentStat = dataConvertor.convertTAgentStat(stats)
      log.info('send Stats\n ', JSON.stringify(tAgentStat))
      const packet = serialize(tAgentStat)
      this.statUdpClient.send(packet)
    }
  }

  closeClient () {
    this.tcpClient.close()
    this.spanUdpClient.close()
  }
}

module.exports = DataSender
