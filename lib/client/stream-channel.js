'use strict'

const StreamCreateSuccessPacket = require('./packet/stream-create-success-packet')
const StreamResponsePacket = require('./packet/stream-response-packet')

class StreamChannel {
  constructor(streamChannelId, dataSender) {
    this.stateCode = null
    this.streamChannelId = streamChannelId
    this.dataSender = dataSender
  }

  sendData(payload) {
    const packet = new StreamResponsePacket(this.streamChannelId, payload)
    this.dataSender.sendPacket(packet)
  }

  sendCreateSuccess () {
    const successPacket = new StreamCreateSuccessPacket(this.streamChannelId)
    this.dataSender.sendPacket(successPacket)
  }
}

module.exports = StreamChannel
