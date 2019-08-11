'use strict'

const EMPTY_PAYLOAD = []

class BasicStreamPacket {
  constructor (streamChannelId, payload = EMPTY_PAYLOAD) {
    this.streamChannelId = streamChannelId
    this.payload = payload
  }

  getPacketType () {
  }

  getPayload () {
    return this.payload
  }

  getStreamChannelId () {
    return this.streamChannelId
  }

  toBuffer () {
  }
}

module.exports = BasicStreamPacket
