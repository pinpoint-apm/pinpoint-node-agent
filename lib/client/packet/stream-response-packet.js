'use strict'

const BasicStreamPacket = require('./basic-stream-packet')
const PacketType = require('./packet-type').PacketType
const { readPayload, appendPayload } = require('./payload-packet')
const TypedBuffer = require('../../utils/typed-buffer')

class StreamResponsePacket extends BasicStreamPacket {
  constructor (streamChannelId, payload) {
    super(streamChannelId, payload)
  }

  getPacketType () {
    return PacketType.APPLICATION_STREAM_RESPONSE
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4 + 4)
    header.writeShort(this.getPacketType())
    header.writeInt(this.getStreamChannelId())
    return appendPayload(header, this.payload)
  }

  static readBuffer (buffer) {
    if (!buffer) {
      return null
    }
    const streamChannelId = buffer.readInt()
    const payload = readPayload(buffer)
    return new StreamResponsePacket(streamChannelId, payload)
  }
}

module.exports = StreamResponsePacket
