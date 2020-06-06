'use strict'

const TcpClient = require('./tcp-client')
const UdpClient = require('./udp-client')
const serialize = require('../data/serialization-util').serialize
const SendPacket = require('./packet/send-packet')
const RequestPacket = require('./packet/request-packet')
const PingPacket = require('./packet/ping-packet')
const StreamResponsePacket = require('./packet/stream-response-packet')
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
      const serializedData = serialize(tAgentInfo)
      if (serializedData) {
        const packet = new SendPacket(serializedData)
        return this.tcpClient.send(packet.toBuffer(), null)
      }
    }
  }

  sendStringMetaInfo (stringMetaInfo) {
    const tStringMetaData = dataConvertor.convertTStringMetaData(stringMetaInfo)
    return this.sendMetaInfo(tStringMetaData)
  }

  sendApiMetaInfo (apiMetaInfo) {
    const tStringMetaData = dataConvertor.convertTApiMetaData(apiMetaInfo)
    return this.sendMetaInfo(tStringMetaData)
  }

  sendMetaInfo (tMetaInfo) {
    if (tMetaInfo && this.enabledDataSending) {
      log.debug('send MetaInfo \n ', tMetaInfo)
      const serializedData = serialize(tMetaInfo)
      if (serializedData) {
        const packet = new RequestPacket(tMetaInfo.apiId, serializedData)
        return this.tcpClient.send(packet.toBuffer(), null)
      }
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
      if (packet) {
        return this.spanUdpClient.send(packet)
      }
    }
  }

  sendSpanChunk (spanChunk) {
    if (spanChunk && this.enabledDataSending) {
      const tSpanChunk = dataConvertor.convertTSpanChunk(spanChunk)
      log.debug('send SpanChunk \n ', tSpanChunk)
      const packet = serialize(tSpanChunk)
      if (packet) {
        return this.spanUdpClient.send(packet)
      }
    }
  }

  sendStats (stats) {
    if (stats && this.enabledDataSending) {
      const tAgentStat = dataConvertor.convertTAgentStat(stats)
      log.debug('send Stats\n ', JSON.stringify(tAgentStat))
      const packet = serialize(tAgentStat)
      if (packet) {
        return this.statUdpClient.send(packet)
      }
    }
  }

  sendActiveThreadCountRes (streamChannelId, activeTrace) {
    if (activeTrace && this.enabledDataSending) {
      const tActiveTrace = dataConvertor.createTActiveTraceCountRes(activeTrace)
      log.debug('send ActiveTrace\n ', streamChannelId, JSON.stringify(tActiveTrace))
      const packet = serialize(tActiveTrace)
      if (packet) {
        return this.tcpClient.send(new StreamResponsePacket(streamChannelId, packet).toBuffer())
      }
    }
  }

  sendPacket (packet) {
    if (this.enabledDataSending) {
      log.debug('send Packet \n ')
      this.tcpClient.send(packet.toBuffer())
    }
  }

  closeClient () {
    this.tcpClient.close()
    this.spanUdpClient.close()
  }
}

module.exports = DataSender
