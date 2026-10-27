/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const os = require('os')
const v8 = require('v8')
const { PerformanceObserver, constants } = require('perf_hooks')

const CPU_CHECK_INTERVAL = 1000
// V8 kGCTypeMinorMarkSweep, the minor GC with --minor-ms; perf_hooks has no constant for it
const GC_MINOR_MARK_SWEEP = 2

class ResourceStatsCollector{
  constructor(options) {
    this.heapMax = v8.getHeapStatistics().heap_size_limit
    this.fileDescriptorStats = options?.fileDescriptorStats === true
    if (options?.gcStats) {
      this.gc = {
        oldCount: 0,
        oldTime: 0,
        newCount: 0,
        newTime: 0,
      }
      this.gcObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => this.recordGc(entry))
      })
      this.gcObserver.observe({ entryTypes: ['gc'] })
    }
  }

  getMemoryStats () {
    const memoryUsage = process.memoryUsage()
    return {
      heapUsed: memoryUsage.heapUsed,
      heapMax: this.heapMax,
      nonHeapUsed: memoryUsage.external,
    }
  }

  getCpuStats () {
    const startHrTime = process.hrtime()
    const startCpuUsage = process.cpuUsage()
    const startSystemCpuTimes = systemCpuTimes()

    return new Promise((resolve) => {
      setTimeout(() => {
        const elapsedHrTime = process.hrtime(startHrTime)
        const elapsedMicroSec = elapsedHrTime[0] * 1000000.0 + elapsedHrTime[1] / 1000.0
        const elapsedCpuUsage = process.cpuUsage(startCpuUsage)

        const userUsage = (elapsedCpuUsage.user) / (elapsedMicroSec || 1)

        resolve({
          user: userUsage,
          system: systemCpuUsage(startSystemCpuTimes, systemCpuTimes()),
        })
      }, CPU_CHECK_INTERVAL)
    })
  }

  getGcStats() {
    if (!this.gcObserver) {
      return undefined
    }
    return {
      oldCount: this.gc.oldCount,
      oldTime: Math.round(this.gc.oldTime),
      newCount: this.gc.newCount,
      newTime: Math.round(this.gc.newTime),
    }
  }

  recordGc(entry) {
    const kind = entry.detail?.kind
    if (kind === constants.NODE_PERFORMANCE_GC_MAJOR) {
      this.gc.oldCount++
      this.gc.oldTime += entry.duration
    } else if (kind === constants.NODE_PERFORMANCE_GC_INCREMENTAL) {
      // Incremental marking steps are part of a major GC, so they add time but not a count
      this.gc.oldTime += entry.duration
    } else if (kind === constants.NODE_PERFORMANCE_GC_MINOR || kind === GC_MINOR_MARK_SWEEP) {
      this.gc.newCount++
      this.gc.newTime += entry.duration
    }
  }

  async getOpenFileDescriptorCount() {
    if (!this.fileDescriptorStats || process.platform !== 'linux') {
      return undefined
    }
    try {
      // Minus 1 to not count the fd that readdir() opens on /proc/self/fd
      return (await fs.promises.readdir('/proc/self/fd')).length - 1
    } catch {
      return undefined
    }
  }

  shutdown() {
    this.gcObserver?.disconnect()
  }
}

function systemCpuTimes() {
  return os.cpus().reduce((sum, cpu) => {
    const times = cpu.times
    sum.idle += times.idle
    sum.total += times.user + times.nice + times.sys + times.irq + times.idle
    return sum
  }, { idle: 0, total: 0 })
}

function systemCpuUsage(start, end) {
  const total = end.total - start.total
  if (total <= 0) {
    return 0
  }
  return 1 - (end.idle - start.idle) / total
}

module.exports = ResourceStatsCollector
