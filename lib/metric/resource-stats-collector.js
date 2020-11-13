/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const v8Compatibility = require('./v8-compatibility')
if (v8Compatibility.enabled()) {
  const v8 = require('v8')
}

const CPU_CHECK_INTERVAL = 1000

class ResourceStatsCollector{
  constructor() {
    this.memory = null
    this.cpu = null
  }

  collect() {
    return {
      memory: this.getMemoryStats(),
      cpu: this.getCpuStats()
    }
  }

  getMemoryStats () {
    const memoryUsage = process.memoryUsage()
    return {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal
    }
  }

  getCpuStats () {
    const startHrTime = process.hrtime()
    const startCpuUsage = process.cpuUsage()

    return new Promise((resolve) => {
      setTimeout(() => {
        const elapsedHrTime = process.hrtime(startHrTime)
        const elapsedMicroSec = elapsedHrTime[0] * 1000000.0 + elapsedHrTime[1] / 1000.0
        const elapsedCpuUsage = process.cpuUsage(startCpuUsage)

        const userUsage = (elapsedCpuUsage.user) / (elapsedMicroSec || 1)
        // todo
        const systemUsage = 0

        resolve({
          user: userUsage,
          system: systemUsage,
        })
      }, CPU_CHECK_INTERVAL)
    })
  }
}

module.exports = ResourceStatsCollector
