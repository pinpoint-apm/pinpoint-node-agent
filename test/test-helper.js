/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const fixture = require('./fixture')
const util = require('./util')

const log = require('../lib/utils/log/logger')
log.setRootLoggerLevel(fixture.config.logLevel)

const enableDataSending = () => {
  fixture.config.enabledDataSending = true
}

const enableStatsMonitorSending = () => {
  fixture.config.statsMonitorSending = true
}

module.exports = {
  util,
  fixture,
  log,
  enableDataSending,
  enableStatsMonitorSending,
}
