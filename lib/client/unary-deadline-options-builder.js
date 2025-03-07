/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DeadlineOptionsBuilder = require('./deadline-options-builder')

// Java agent DEFAULT_CLIENT_REQUEST_TIMEOUT = 6000
const defaultDeadlineSeconds = 6
class UnaryDeadlineOptionsBuilder extends DeadlineOptionsBuilder {
    constructor(deadlineSeconds = defaultDeadlineSeconds) {
        super(deadlineSeconds)
    }
}

module.exports = UnaryDeadlineOptionsBuilder