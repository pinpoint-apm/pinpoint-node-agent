/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DeadlineOptionsBuilder {
    constructor(deadlineSeconds) {
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