const fixture = require('./fixture')
const util = require('./util')

const log = require('utils/logger')
log.init(fixture.config.logLevel)

const enableDataSending = () => {
  fixture.config.enabledDataSending = true
}

module.exports = {
  util,
  fixture,
  log,
  enableDataSending,
}
