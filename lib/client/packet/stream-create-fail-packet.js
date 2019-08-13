'use strict'

const BasicStreamPacket = require('./basic-stream-packet')
const PacketType = require('./packet-type').PacketType
const TypedBuffer = require('../../utils/typed-buffer')

class StreamCreateFailPacket extends BasicStreamPacket {
  constructor (streamChannelId) {
    super(streamChannelId)
    this.code = null
  }

  getPacketType () {
    return PacketType.APPLICATION_STREAM_CREATE_FAIL
  }

  toBuffer () {
    const header = TypedBuffer.alloc(2 + 4 + 4)
    header.writeShort(this.getPacketType())
    header.writeInt(this.getStreamChannelId())
    header.writeShort(this.code)
    return header.buffer
  }

  static readBuffer (buffer) {
    if (!buffer) {
      return null
    }
    const streamChannelId = buffer.readInt()
    this.code = buffer.readShort()
    return new StreamCreateFailPacket(streamChannelId)
  }
}

module.exports = StreamCreateFailPacket
