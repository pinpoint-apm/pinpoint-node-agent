const net = require('net')

const TcpClient = require('sender/tcp-client')
const serialize = require('data/serializer').serialize
const SendPacket = require('sender/packet/send-packet')

class DataSender {
  constructor (config) {
    if (!config) {
      throw new Error()
    }
    this.collectorIp = config.collectorIp
    this.collectorTcpPort = config.collectorTcpPort
    this.collectorStatPort = config.collectorStatPort
    this.collectorSpanPort = config.collectorSpanPort

    this.tcpClient = new TcpClient(this.collectorIp, this.collectorTcpPort)
  }

  send (tData) {
    if (tData) {
      const packet = new SendPacket(serialize(tData)).toBuffer()
      this.tcpClient.send(packet)
    }
  }
}

module.exports = DataSender
