'use strict'

const StreamStateCode = require('./stream-state-code')
const StreamCreateSuccessPacket = require('./packet/stream-create-success-packet')
const StreamResponsePacket = require('./packet/stream-response-packet')


class StreamChannel {
  constructor(id, dataSender, streamChannelManger) {
    this.id = id
    this.dataSender = dataSender

    this.stateCode = StreamStateCode.OPEN
    streamChannelManger.add(this)
  }

  setClosed() {
    this.stateCode = StreamStateCode.CLOSED
  }

  isOpen() {
    return this.stateCode === StreamStateCode.OPEN
  }

  sendData(payload) {
    const packet = new StreamResponsePacket(this.id, payload)
    this.dataSender.sendPacket(packet)
  }

  sendCreateSuccess () {
    const successPacket = new StreamCreateSuccessPacket(this.id)
    this.dataSender.sendPacket(successPacket)
  }
}

module.exports = StreamChannel
