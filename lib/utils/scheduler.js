/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('./log/logger')

const DEFAULT_INTERVAL = 3000

class Scheduler {
  constructor(interval) {
    this.interval = interval || DEFAULT_INTERVAL

    this.timeout = null
    this.jobList = []
  }

  start(runJobInitially) {
    if (this.isRunning()) {
      log.error('The scheduler is already running')
      return
    }
    if (runJobInitially) {
      setTimeout(() => this.runJobs(), 0)
    }
    log.info('The scheduler is scheduled to run every ' + this.interval + 'ms')
    this.timeout = setInterval(() => this.runJobs(), this.interval)
  }

  stop() {
    if (this.isRunning()) {
      log.info('The scheduler is stopped')
      clearInterval(this.timeout)
      this.timeout = null
    }
  }

  runJobs() {
    this.jobList.forEach(job => job && job.apply())
  }

  isRunning() {
    return this.timeout
  }

  addJob(jobFn) {
    if (this.jobList.includes(jobFn)) {
      log.error('It it not able to add duplicate job')
      return
    }
    this.jobList.push(jobFn)
    return () => this.removeJob(jobFn)
  }

  removeJob(jobFn) {
    const i = this.jobList.indexOf(jobFn)
    if (i >= 0) {
      this.jobList.splice(i, 1)
    }
  }
}

module.exports = Scheduler
