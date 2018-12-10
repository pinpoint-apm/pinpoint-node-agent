'use strict'

const net = require('net')

const TcpClient = require('sender/tcp-client')
const UdpClient = require('sender/udp-client')
const serialize = require('data/serializer').serialize
const SendPacket = require('sender/packet/send-packet')
const RequestPacket = require('sender/packet/request-packet')
const TSpan = require('data/dto/Trace_types').TSpan
const log = require('utils/logger')

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
    this.spanUdpClient = new UdpClient(this.collectorIp, this.collectorSpanPort)
  }

  send (tData) {
    if (tData && this.enabledDataSending) {
      log.debug('tData >> ', tData)
      const packet = new SendPacket(serialize(tData)).toBuffer()
      log.debug('packet >> ', packet)
      this.tcpClient.send(packet)
    }
  }

  sendApiMetaInfo (tApiMetaInfo) {
    if (tApiMetaInfo && this.enabledDataSending) {
      log.debug('tApiMetaInfo >> ', tApiMetaInfo)
      const packet = new RequestPacket(tApiMetaInfo.apiId, serialize(tApiMetaInfo)).toBuffer()
      log.debug('packet >> ', packet)
      this.tcpClient.send(packet)
    }
  }

  sendSpan (span) {
    if (span && this.enabledDataSending) {
      const tSpan = new TSpan(span)
      log.debug('spanData>> ', tSpan)
      const packet = serialize(tSpan)
      log.debug('packet >> ', packet)
      this.spanUdpClient.send(packet)
    }
  }

  closeClient () {
    this.tcpClient.close()
    this.spanUdpClient.close()
  }
}

module.exports = DataSender
