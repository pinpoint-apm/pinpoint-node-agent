'use strict'

const BasicPacket = require('./basic-packet')
const PacketType = require('./packet-type').PacketType
const appendPayload = require('./payload-packet').appendPayload
const TypedBuffer = require('../../utils/typed-buffer')

class RequestPacket extends BasicPacket {
  constructor (requestId = 0, payload) {
    super(payload)
    this.requestId = requestId
  }

  getPacketType () {
    return PacketType.APPLICATION_REQUEST
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4 + 4)
    header.writeShort(this.getPacketType())
    header.writeInt(this.requestId);
    return appendPayload(header, this.payload)
  }
}

module.exports = RequestPacket
