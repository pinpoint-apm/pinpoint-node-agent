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
  constructor(
    collectorIp,
    collectorTcpPort,
    collectorStatPort,
    collectorSpanPort,
    agentInfo
  ) {
    this.agentInfo = agentInfo
    this.tcpClient = new TcpClient(collectorIp, collectorTcpPort)

    if (this.tcpClient) {
      this.socketStateCode = SocketStateCode.RUN_WITHOUT_HANDSHAKE
    }

    this.spanUdpClient = new UdpClient(collectorIp, collectorSpanPort)
    this.statUdpClient = new UdpClient(collectorIp, collectorStatPort)
  }

  sendAgentInfo(agentInfo) {
    if (agentInfo) {
      const tAgentInfo = dataConvertor.convertTAgentInfo(agentInfo)
      log.debug('send AgentInfo \n ', tAgentInfo)
      const serializedData = serialize(tAgentInfo)
      if (serializedData) {
        const packet = new SendPacket(serializedData)
        return this.tcpClient.sendRetryable(packet.toBuffer(), null, 10)
      }
    }
  }

  sendStringMetaInfo(stringMetaInfo) {
    const tStringMetaData = dataConvertor.convertTStringMetaData({
      agentId: this.agentInfo.agentId,
      agentStartTime: this.agentInfo.agentStartTime,
      stringId: stringMetaInfo.stringId,
      stringValue: stringMetaInfo.stringValue
    })
    return this.sendMetaInfo(tStringMetaData)
  }

  sendApiMetaInfo(apiMetaInfo) {
    const tStringMetaData = dataConvertor.convertTApiMetaData({
      agentId: this.agentInfo.agentId,
      agentStartTime: this.agentInfo.agentStartTime,
      apiId: apiMetaInfo.apiId,
      apiInfo: apiMetaInfo.apiDescriptor,
      type: apiMetaInfo.type,
    })
    return this.sendMetaInfo(tStringMetaData)
  }

  sendMetaInfo(tMetaInfo) {
    if (tMetaInfo) {
      log.debug('send MetaInfo \n ', tMetaInfo)
      const serializedData = serialize(tMetaInfo)
      if (serializedData) {
        const packet = new RequestPacket(tMetaInfo.apiId, serializedData)
        return this.tcpClient.sendRetryable(packet.toBuffer(), null)
      }
    }
  }

  sendControlHandshake(params) {
    log.debug('send Handshake \n ')
    const packet = new ControlHandshakePacket(0, params)
    this.tcpClient.send(packet.toBuffer())
  }

  sendPing() {
    log.debug('send Ping \n ')
    const packet = new PingPacket(pingIdGenerator.next, 0, this.socketStateCode)
    this.tcpClient.send(packet.toBuffer())
  }

  sendSpan(span) {
    if (span) {
      const tSpan = dataConvertor.convertTSpan(span)
      log.debug('send Span \n ', tSpan)
      const packet = serialize(tSpan)
      if (packet) {
        return this.spanUdpClient.send(packet)
      }
    }
  }

  sendSpanChunk(spanChunk) {
    if (spanChunk) {
      const tSpanChunk = dataConvertor.convertTSpanChunk(spanChunk)
      log.info('send SpanChunk \n ', tSpanChunk)
      const packet = serialize(tSpanChunk)
      if (packet) {
        return this.spanUdpClient.send(packet)
      }
    }
  }

  sendStats(stats) {
    if (stats) {
      const tAgentStat = dataConvertor.convertTAgentStat(stats)
      log.info('send Stats\n ', JSON.stringify(tAgentStat))
      const packet = serialize(tAgentStat)
      if (packet) {
        return this.statUdpClient.send(packet)
      }
    }
  }

  sendActiveThreadCountRes(streamChannelId, activeTrace) {
    if (activeTrace) {
      const tActiveTrace = dataConvertor.createTActiveTraceCountRes(activeTrace)
      log.info('send ActiveTrace\n ', streamChannelId, JSON.stringify(tActiveTrace))
      const packet = serialize(tActiveTrace)
      if (packet) {
        return this.tcpClient.send(new StreamResponsePacket(streamChannelId, packet).toBuffer())
      }
    }
  }

  sendPacket(packet) {
    log.debug('send Packet \n ')
    this.tcpClient.send(packet.toBuffer())
  }

  closeClient() {
    this.tcpClient.close()
    this.spanUdpClient.close()
  }
}

module.exports = DataSender
