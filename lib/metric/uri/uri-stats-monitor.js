/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Scheduler = require('../../utils/scheduler')

class UriStatsMonitor {
    constructor(dataSender, uriStatsRepository) {
        this.dataSender = dataSender
        this.uriStatsRepository = uriStatsRepository
        this.timeWindow = uriStatsRepository.getTimeWindow()
    }

    start() {
        if (!this.scheduler) {
            this.scheduler = new Scheduler(this.timeWindow)
            this.scheduler.addJob(() => {
                this.run()
            })
        }
        this.scheduler.start()
    }

    run() {
        if (!this.uriStatsRepository) {
            return
        }

        let snapshot = this.uriStatsRepository.poll()
        while (snapshot) {
            this.dataSender.send(snapshot)
            snapshot = this.uriStatsRepository.poll()
        }
    }

    stop() {
        this.scheduler.stop()
    }
}

module.exports = {
    UriStatsMonitor
}