/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ResourceStatsCollector = require('./resource-stats-collector')
const log = require('../utils/log/logger')
const activeRequestRepository = require('../metric/active-request-repository')
const TransactionMetric = require('./transaction-metric')

// The stats scheduler interval in AgentBuilder; the collector divides transaction counts by it for TPS
const COLLECT_INTERVAL = 5000

class AgentStatsMonitor {
  constructor(dataSender, agentId, agentStartTime, options) {
    this.resourceStatCollector = new ResourceStatsCollector(options)
    this.dataSender = dataSender
    this.agentId = agentId
    this.agentStartTime = agentStartTime
    this.transactionMetric = new TransactionMetric()
  }

  run() {
    this.send()
  }

  send() {
    if (this.dataSender) {
      Promise.all([this.resourceStatCollector.getCpuStats(), this.resourceStatCollector.getOpenFileDescriptorCount()])
        .then(([cpuStatus, openFileDescriptorCount]) => {
          if (this.closed) {
            return
          }
          const statsInfo = this.createStatsInfo(cpuStatus, openFileDescriptorCount)
          this.dataSender.sendStat(statsInfo)
          log.info('send full stats at' + statsInfo.timestamp)
        }, () => {
          if (this.closed) {
            return
          }
          const statsInfo = this.createStatsInfo({})
          this.dataSender.sendStat(statsInfo)
          log.info('send without cpu stats at' + statsInfo.timestamp)
        })
        .catch((e) => {
          log.error('fail to send agent stats at' + Date.now(), e)
        })
    }
  }

  createStatsInfo(cpuStatus, openFileDescriptorCount) {
    return {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      timestamp: Date.now(),
      collectInterval: COLLECT_INTERVAL,
      memory: this.resourceStatCollector.getMemoryStats(),
      gc: this.resourceStatCollector.getGcStats(),
      cpu: cpuStatus,
      openFileDescriptorCount,
      activeTrace: activeRequestRepository.getCurrentActiveTraceHistogram(),
      transaction: this.transactionMetric.snapshot(),
      responseTime: activeRequestRepository.collectResponseTime(),
    }
  }

  shutdown() {
    this.closed = true
    this.resourceStatCollector.shutdown()
  }
}

AgentStatsMonitor.COLLECT_INTERVAL = COLLECT_INTERVAL
module.exports = AgentStatsMonitor
