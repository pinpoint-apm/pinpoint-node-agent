/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ResourceStatsCollector = require('./resource-stats-collector')
const log = require('../utils/log/logger')
const activeRequestRepository = require('../metric/active-request-repository')

class AgentStatsMonitor {
  constructor(dataSender, agentId, agentStartTime) {
    this.resourceStatCollector = new ResourceStatsCollector()
    this.dataSender = dataSender
    this.agentId = agentId
    this.agentStartTime = agentStartTime
  }

  run() {
    this.send()
  }

  send() {
    if (this.dataSender) {
      this.resourceStatCollector.getCpuStats()
        .then((cpuStatus) => {
          const statsInfo = this.createStatsInfo(cpuStatus)
          this.dataSender.sendStat(statsInfo)
          log.info('send full stats at' + statsInfo.timestamp)
        }, () => {
          const statsInfo = this.createStatsInfo({})
          this.dataSender.sendStat(statsInfo)
          log.info('send without cpu stats at' + statsInfo.timestamp)
        })
        .catch((e) => {
          log.error('fail to send agent stats at' + Date.now(), e)
        })
    }
  }

  createStatsInfo(cpuStatus) {
    return {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      timestamp: Date.now(),
      collectInterval: 1000,
      memory: this.resourceStatCollector.getMemoryStats(),
      cpu: cpuStatus,
      activeTrace: activeRequestRepository.getCurrentActiveTraceHistogram(),
    }
  }
}

module.exports = AgentStatsMonitor
