/**
 * Pinpoint Node.js Agent - Logging Module Exports
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const LogBuilder = require('./log-builder')
const logger = require('./logger')

module.exports = {
    LogBuilder,
    LogLevel: LogBuilder.LogLevel,
    logger
}
