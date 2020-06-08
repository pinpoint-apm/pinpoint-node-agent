'use strict'

const PacketType = require('./packet-type').PacketType
const TypedBuffer = require('../../utils/typed-buffer')

class PingPacket {
  constructor (pingId, stateCodeVersion, stateCode) {
    this.pingId = pingId
    this.stateCodeVersion = stateCodeVersion
    this.stateCode = stateCode
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2)
    header.writeShort(PacketType.CONTROL_PING_SIMPLE)
    return header.buffer
  }
}

module.exports = PingPacket
