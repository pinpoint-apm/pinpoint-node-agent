'use strict'

const StreamChannel = require('./stream-channel')

class StreamChannelManger {
  constructor(dataSender) {
    this.streamChannels = new Map()
    this.dataSender = dataSender
  }

  create (streamChannelId) {
    if (this.streamChannels.has(streamChannelId)) {
      this.close(streamChannelId)
    }
    const streamChannel = new StreamChannel(streamChannelId, this.dataSender)
    this.streamChannels.set(streamChannelId, streamChannel)
    return streamChannel
  }

  close (streamChannelId) {
    this.streamChannels.delete(streamChannelId)
  }
}

module.exports = StreamChannelManger
