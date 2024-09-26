/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Scheduler = require('../utils/scheduler')
const activeTrace = require('./active-trace')

class ActiveThreadCount {
  constructor(dataSender, streamChannelManager, enabled) {
    this.dataSender = dataSender
    this.streamChannelManager = streamChannelManager
    this.enabled = enabled

    this.isScheduling = false
    this.removeJob = null

    if (this.scheduler) {
      this.scheduler.stop()
    }
    this.scheduler = new Scheduler(2000)
  }

  run() {
    if(this.enabled && !this.isScheduling) {
      this.startScheduling()
    }
  }

  startScheduling () {
    this.removeJob = this.scheduler.addJob(() => {
      const streamChannels = this.streamChannelManager.getOpenChannels()
      if (streamChannels.length < 1) {
        this.stopScheduling()
      }
      const histogram = activeTrace.getCurrentActiveTraceHistogram()
      streamChannels.forEach(channel => this.dataSender.sendActiveThreadCountRes(channel.id, histogram))
    })
    this.scheduler.start(true)
    this.isScheduling = true
  }

  stopScheduling () {
    if (this.removeJob) {
      this.removeJob()
    }
    this.scheduler.stop()
    this.isScheduling = false
  }
}

module.exports = ActiveThreadCount
