'use strict'

const log = require('./logger')

const DEFAULT_TIMEOUT = 1000

class Scheduler {
  constructor (interval) {
    this.interval = interval || DEFAULT_TIMEOUT

    this.timeout = null
    this.jobList = []
  }

  start() {
    if (this.timeout !== null) {
      throw new Error('scheduler is already running')
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
      throw new Error('cannot add duplicate job')
    }
    this.jobList.push(jobFn)
  }

  removeJob(jobFn) {
    const i = this.jobList.indexOf(jobFn)
    if (i >= 0) {
      delete this.jobList(i)
    }
  }
}

module.exports = {
  mainScheduler: new Scheduler(4000),
  retryScheduler: new Scheduler(3000)
}
