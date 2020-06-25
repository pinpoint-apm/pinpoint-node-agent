'use strict'

const Scheduler = require('../utils/scheduler')
class PingScheduler {
    constructor(dataSender) {
        this.dataSender = dataSender
        this.scheduler = new Scheduler(5 * 60 * 1000)
        this.removeJob = this.scheduler.addJob(() => {
            this.dataSender.sendPing()
        })
        this.scheduler.start()
    }

    stop() {
        if (this.removeJob) {
            this.removeJob()
        }
        this.scheduler.stop()
    }
}

module.exports = PingScheduler