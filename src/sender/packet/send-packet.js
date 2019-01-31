'use strict'

const BasicPacket = require('./basic-packet')
const PacketType = require('./packet-type').PacketType
const appendPayload = require('./payload-packet').appendPayload
const TypedBuffer = require('../../utils/typed-buffer')

class SendPacket extends BasicPacket {
  getPacketType () {
    return PacketType.APPLICATION_SEND
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4)
    header.writeShort(this.getPacketType())
    return appendPayload(header, this.payload)
  }
}

module.exports = SendPacket
