'use strict'

const v8 = require('v8')

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

        const userUsage = (elapsedCpuUsage.user) / elapsedMicroSec
        // todo
        const systemUsage = 0

        resolve({
          user: userUsage,
          system: systemUsage,
        })
      }, 1000)
    })
  }
}

module.exports = ResourceStatsCollector
