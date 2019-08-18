'use strict'

const StreamChannel = require('./stream-channel')

class StreamChannelManger {
  constructor(dataSender) {
    this.streamChannels = new Map()
    this.dataSender = dataSender
  }

  add (newStreamChannel) {
    if (this.streamChannels.has(newStreamChannel.id)) {
      const streamChannel = this.streamChannels.get(newStreamChannel.id)
      if (streamChannel === newStreamChannel || streamChannel.isOpen()) {
        return newStreamChannel
      }
      this.remove(streamChannel)
    }
    this.streamChannels.set(newStreamChannel.id, newStreamChannel)
    return newStreamChannel
  }

  remove (streamChannelId) {
    const streamChannel = this.streamChannels.get(streamChannelId)
    if (streamChannel) {
      streamChannel.setClosed()
      this.streamChannels.delete(streamChannelId)
    }
    return streamChannel
  }

  getOpenChannels () {
    return Array.from(this.streamChannels.values())
    .filter(streamChannel => streamChannel.isOpen())
  }
}

module.exports = StreamChannelManger
