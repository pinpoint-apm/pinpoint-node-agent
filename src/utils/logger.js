'use strict'

const loglevel = require('loglevel');

class Logger {
  constructor() {
    this.logger = null
    this.LOG_LEVEL = loglevel.levels
    this.DEFAULT_LEVEL = this.LOG_LEVEL.SILENT
    this.DEFAULT_NAME = 'default_logger'
  }

  init (logLevel, name) {
    this.logger = loglevel.getLogger(name || this.DEFAULT_NAME)
    this.logger.setLevel(logLevel || this.DEFAULT_LEVEL)
  }

  get log() {
    if (!this.logger) {
      this.init()
      this.logger.info('init logger with default level')
    }
    return this.logger
  }

  debug() {
    this.logger.debug.apply(null, arguments)
  }

  info() {
    this.logger.info.apply(arguments)
  }

  warn() {
    this.logger.warn.apply(arguments)
  }

  error() {
    this.logger.error.apply(arguments)
  }
}

module.exports = new Logger()
