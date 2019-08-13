'use strict'

const Scheduler = require('../utils/scheduler')
const activeTrace = require('../metric/active-trace')
const BasicStreamPacket = require('./packet/basic-stream-packet')
const { PacketType } = require('./packet/packet-type')
const log = require('../utils/logger')

class MessageHandler {
  constructor(dataSender, streamChannelManager, enabledActiveThreadCount) {
    this.dataSender = dataSender
    this.streamChannelManager = streamChannelManager
    this.enabledActiveThreadCount = enabledActiveThreadCount
    this.scheduler = new Scheduler(1000)
    this.activeThreadCountFn = null
  }

  handle (packet) {
    if (!packet) {
      return null
    }
    if (packet instanceof BasicStreamPacket) {
      this.handleStream(packet)
    }
  }

  handleStream (packet) {
    switch (packet.getPacketType()) {
      case PacketType.APPLICATION_STREAM_CREATE:
        this.createStream(packet)
        if (this.enabledActiveThreadCount) {
          this.startActiveThreadCountScheduling(packet.getStreamChannelId())
        }
        break
      case PacketType.APPLICATION_STREAM_CREATE_FAIL:
      case PacketType.APPLICATION_STREAM_CLOSE:
        this.closeStream(packet)
        if (this.enabledActiveThreadCount) {
          this.stopActiveThreadCountScheduling()
        }
        break
    }
  }

  createStream (packet) {
    const streamChannelId = packet.getStreamChannelId()
    const streamChannel = this.streamChannelManager.create(streamChannelId)
    streamChannel.sendCreateSuccess()
  }

  closeStream (packet) {
    const streamChannelId = packet.getStreamChannelId()
    this.streamChannelManager.close(streamChannelId)
  }

  startActiveThreadCountScheduling (streamChannelId) {
    if (!this.activeThreadCountFn) {
      this.activeThreadCountFn = () => {
        this.dataSender.sendActiveThreadCountRes(streamChannelId, activeTrace.getCurrentActiveTraceHistogram())
      }
      this.scheduler.addJob(this.activeThreadCountFn)
      this.scheduler.start()
    }
  }

  stopActiveThreadCountScheduling () {
    if (this.activeThreadCountFn) {
      this.scheduler.removeJob(this.activeThreadCountFn)
      this.scheduler.stop()
    }
  }
}

module.exports = MessageHandler
