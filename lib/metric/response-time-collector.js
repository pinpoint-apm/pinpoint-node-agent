/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// ReuseResponseTimeCollector.java
class ResponseTimeCollector {
    constructor() {
        this.totalTime = 0
        this.count = 0
        this.max = 0
    }

    add(elapsedTime) {
        this.totalTime += elapsedTime
        this.count++
        this.max = Math.max(this.max, elapsedTime)
    }

    collect() {
        const responseTime = {
            avg: this.count === 0 ? 0 : Math.floor(this.totalTime / this.count),
            max: this.max,
        }
        this.totalTime = 0
        this.count = 0
        this.max = 0
        return responseTime
    }
}

module.exports = ResponseTimeCollector
