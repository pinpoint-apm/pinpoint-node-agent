/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DeadlineOptionsBuilder = require('./deadline-options-builder')

const defaultSeconds = 10 * 60 // 10 minutes
class StreamDeadlineOptionsBuilder extends DeadlineOptionsBuilder {
    constructor(config) {
        const seconds = isNaN(config?.getDeadlineSeconds?.()) ? defaultSeconds : config.getDeadlineSeconds()
        super(seconds)
    }
}

module.exports = StreamDeadlineOptionsBuilder