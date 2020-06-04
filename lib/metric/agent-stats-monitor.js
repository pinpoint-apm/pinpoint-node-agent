'use strict'

const ResourceStatsCollector = require('./resource-stats-collector')
const activeTrace = require('./active-trace')
const log = require('../utils/logger')

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
          this.dataSender.sendStats(this.createStatsInfo(cpuStatus))
          log.debug('send full stats at' + statsInfo.timestamp)
        }, () => {
          const statsInfo = this.createStatsInfo({})
          this.dataSender.sendStats(this.createStatsInfo(cpuStatus))
          log.debug('send without cpu stats at' + statsInfo.timestamp)
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
      activeTrace: activeTrace.getCurrentActiveTraceHistogram(),
    }
  }
}

module.exports = AgentStatsMonitor
