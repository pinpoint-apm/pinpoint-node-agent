const BasicPacket = require('./basic-packet')
const PacketType = require('./packet-type').PacketType
const appendPayload = require('./payload-packet').appendPayload

class SendPacket extends BasicPacket {
  getPacketType () {
    return PacketType.APPLICATION_SEND
  }

  toBuffer () {
    var header = new Buffer(2 + 4)
    header.writeInt16BE(this.getPacketType())
    return appendPayload(header, this.payload)
  }
}

module.exports = SendPacket