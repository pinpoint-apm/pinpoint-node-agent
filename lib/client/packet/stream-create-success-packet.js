'use strict'

const BasicStreamPacket = require('./basic-stream-packet')
const PacketType = require('./packet-type').PacketType
const TypedBuffer = require('../../utils/typed-buffer')

class StreamCreateSuccessPacket extends BasicStreamPacket {
  constructor (streamChannelId) {
    super(streamChannelId)
  }

  getPacketType () {
    return PacketType.APPLICATION_STREAM_CREATE_SUCCESS
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4)
    header.writeShort(this.getPacketType())
    header.writeInt(this.getStreamChannelId())
    return header.buffer
  }

  static readBuffer (buffer) {
    if (!buffer) {
      return null
    }
    const streamChannelId = buffer.readInt()
    return new StreamCreateSuccessPacket(streamChannelId)
  }
}

module.exports = StreamCreateSuccessPacket
