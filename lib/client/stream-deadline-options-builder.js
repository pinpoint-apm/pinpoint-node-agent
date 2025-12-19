/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DeadlineOptionsBuilder = require('./deadline-options-builder')

class StreamDeadlineOptionsBuilder extends DeadlineOptionsBuilder {
    constructor(config) {
        const seconds = config.getDeadlineSeconds()
        super(seconds)
    }
}

module.exports = StreamDeadlineOptionsBuilder