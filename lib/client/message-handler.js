'use strict'

const BasicStreamPacket = require('./packet/basic-stream-packet')
const StreamChannel = require('./stream-channel')
const { PacketType } = require('./packet/packet-type')
const log = require('../utils/logger')

class MessageHandler {
  constructor(dataSender, streamChannelManager, activeThreadCount) {
    this.dataSender = dataSender
    this.streamChannelManager = streamChannelManager
    this.activeThreadCount = activeThreadCount
  }

  handle (packet) {
    if (!packet) {
      return null
    }
    log.info('[MessageHandler] received', packet)
    if (packet instanceof BasicStreamPacket) {
      this.handleStream(packet)
    }
  }

  handleStream (packet) {
    switch (packet.getPacketType()) {
      case PacketType.APPLICATION_STREAM_CREATE:
        this.createStream(packet)
        this.activeThreadCount.run()
        break
      case PacketType.APPLICATION_STREAM_CREATE_FAIL:
      case PacketType.APPLICATION_STREAM_CLOSE:
        this.closeStream(packet)
        break
    }
  }

  createStream (packet) {
    const streamChannel = new StreamChannel(packet.getStreamChannelId(), this.dataSender, this.streamChannelManager)
    streamChannel.sendCreateSuccess()
  }

  closeStream (packet) {
    const streamChannelId = packet.getStreamChannelId()
    this.streamChannelManager.remove(streamChannelId)
  }
}

module.exports = MessageHandler
