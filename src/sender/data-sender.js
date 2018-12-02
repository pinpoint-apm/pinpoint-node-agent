const net = require('net')

const TcpClient = require('sender/tcp-client')
const UdpClient = require('sender/udp-client')
const serialize = require('data/serializer').serialize
const SendPacket = require('sender/packet/send-packet')
const TSpan = require('data/dto/Trace_types').TSpan

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
      console.log('tData >> ', tData)
      const packet = new SendPacket(serialize(tData)).toBuffer()
      console.log('packet >> ', packet)
      this.tcpClient.send(packet)
    }
  }

  sendSpan (span) {
    if (span && this.enabledDataSending) {
      const tSpan = new TSpan(span)
      console.log('tData >> ', tSpan)
      const packet = serialize(tSpan)
      console.log('packet >> ', packet)
      this.spanUdpClient.send(packet)
    }
  }
}

module.exports = DataSender
