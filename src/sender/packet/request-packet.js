const BasicPacket = require('./basic-packet')
const PacketType = require('./packet-type').PacketType
const appendPayload = require('./payload-packet').appendPayload

class RequestPacket extends BasicPacket {
  constructor (requestId, payload) {
    super(payload)
    this.requestId = requestId
  }


  getPacketType () {
    return PacketType.APPLICATION_REQUEST
  }

  toBuffer () {
    var header = new Buffer(2 + 4 + 4)
    header.writeInt16BE(this.getPacketType())
    header.writeInt32BE(this.requestId, 2);
    return appendPayload(header, this.payload, 6)
  }
}

module.exports = RequestPacket