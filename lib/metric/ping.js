'use strict'

const Scheduler = require('../utils/scheduler')
const log = require('../utils/logger')

class Ping {
    constructor(dataSender) {
        this.dataSender = dataSender
        this.scheduler = new Scheduler(5 * 60 * 1000)
        this.scheduler.addJob(() => { this.run() })
        this.scheduler.start()
    }

    run() {
        this.dataSender.sendPing()
    }
}

module.exports = Ping