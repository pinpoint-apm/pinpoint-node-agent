const fixture = require('./fixture')
const util = require('./util')

const log = require('../src/utils/logger')
log.init(fixture.config.logLevel)

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
