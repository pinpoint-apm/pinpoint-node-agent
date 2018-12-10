'use strict'

class BasicPacket {
  constructor (payload) {
    if (!payload) {
      throw new Error()
    }
    this.payload = payload
  }

  getPacketType () {
  }

  getPayload () {
    return this.payload
  }

  toBuffer () {
  }
}

module.exports = BasicPacket