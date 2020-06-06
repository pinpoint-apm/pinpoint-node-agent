'use strict'

const PacketType = require('./packet-type').PacketType
const TypedBuffer = require('../../utils/typed-buffer')

class PingPacket {
  constructor (pingId, stateCodeVersion, stateCode) {
    this.pingId = pingId
    this.stateCodeVersion = stateCodeVersion
    this.stateCode = stateCode
  }

  getPacketType () {
    return PacketType.CONTROL_PING_PAYLOAD
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4 + 1 + 1)
    header.writeShort(this.getPacketType())
    header.writeInt(this.pingId);
    header.writeByte(this.stateCodeVersion)
    header.writeByte(this.stateCode)
    return header.buffer
  }
}

module.exports = PingPacket
