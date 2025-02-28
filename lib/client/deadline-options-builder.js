/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DeadlineOptions {
    constructor(deadlineSeconds) {
        this.deadlineSeconds = deadlineSeconds
    }

    getOptions() {
        const deadline = new Date()
        deadline.setSeconds(deadline.getSeconds() + this.deadlineSeconds)
        return { deadline }
    }
}

const defaultDeadlineSeconds = 10 * 60
class DeadlineOptionsBuilder {
    constructor(deadlineSeconds = defaultDeadlineSeconds) {
        this.deadlineSeconds = deadlineSeconds
    }

    setSeconds(seconds) {
        this.deadlineSeconds = seconds
        return this
    }

    build() {
        return new DeadlineOptions(this.deadlineSeconds)
    }
}

module.exports = DeadlineOptionsBuilder