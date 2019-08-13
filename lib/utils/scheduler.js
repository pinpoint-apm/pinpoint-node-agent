'use strict'

const log = require('./logger')

const DEFAULT_INTERVAL = 3000

class Scheduler {
  constructor (interval) {
    this.interval = interval || DEFAULT_INTERVAL

    this.timeout = null
    this.jobList = []
  }

  start() {
    if (this.timeout !== null) {
      log.error('scheduler is already running')
      return
    }
    log.info('scheduler is scheduled to run every ' + this.interval + 'ms')
    this.timeout = setInterval(() => this.runJobs(), this.interval)
  }

  stop() {
    if (this.timeout !== null) {
      clearInterval(this.timeout)
    }
  }

  runJobs() {
    this.jobList.forEach(job => job && job.apply())
  }

  isRunning() {
    return this.timeout && this.timeout.hasRef()
  }

  addJob(jobFn) {
    if (this.jobList.includes(jobFn)) {
      log.error('cannot add duplicate job')
      return
    }
    this.jobList.push(jobFn)
  }

  removeJob(jobFn) {
    const i = this.jobList.indexOf(jobFn)
    if (i >= 0) {
      this.jobList.splice(i, 1)
    }
  }
}

module.exports = Scheduler
