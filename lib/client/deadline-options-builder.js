/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// Java agent DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000
const defaultDeadlineSeconds = 6
class DeadlineOptionsBuilder {
    constructor(deadlineSeconds = defaultDeadlineSeconds) {
        this.deadlineSeconds = deadlineSeconds
    }

    setSeconds(seconds) {
        this.deadlineSeconds = seconds
        return this
    }

    build() {
        const deadline = new Date()
        deadline.setSeconds(deadline.getSeconds() + this.deadlineSeconds)
        return { deadline }
    }
}

module.exports = DeadlineOptionsBuilder