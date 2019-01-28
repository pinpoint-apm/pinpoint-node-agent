'use strict'

const net = require('net')

const TcpClient = require('./tcp-client')
const UdpClient = require('./udp-client')
const serialize = require('../data/serializer').serialize
const SendPacket = require('./packet/send-packet')
const RequestPacket = require('./packet/request-packet')
const TSpan = require('../data/dto/Trace_types').TSpan
const dataConvertor = require('../data/data-convertor')
const log = require('../utils/logger')

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
    this.statUdpClient = new UdpClient(this.collectorIp, this.collectorStatPort)
  }

  send (tData) {
    if (tData && this.enabledDataSending) {
      log.debug('>> TDATA \n ', tData)
      const packet = new SendPacket(serialize(tData)).toBuffer()
      this.tcpClient.send(packet)
    }
  }

  sendMetaInfo (tApiMetaInfo) {
    if (tApiMetaInfo && this.enabledDataSending) {
      log.debug('>> META INFO \n ', tApiMetaInfo)
      const packet = new RequestPacket(tApiMetaInfo.apiId, serialize(tApiMetaInfo)).toBuffer()
      this.tcpClient.send(packet)
    }
  }

  sendSpan (span) {
    if (span && this.enabledDataSending) {
      const tSpan = new TSpan(span)
      log.debug('>> SPAN DATA \n ', tSpan)
      const packet = serialize(tSpan)
      this.spanUdpClient.send(packet)
    }
  }

  sendStats (stats) {
    if (stats && this.enabledDataSending) {
      const tAgentStat = dataConvertor.convertTAgentStat(stats)
      log.info('>> stat data\n ', JSON.stringify(tAgentStat))
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
