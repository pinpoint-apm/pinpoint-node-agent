/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const loglevel = require('loglevel')

class Logger {
  constructor() {
    this.LOG_LEVEL = loglevel.levels
    this.DEFAULT_LEVEL = this.LOG_LEVEL.SILENT
    this.DEFAULT_NAME = 'default_logger'
    this.init()
  }

  init(logLevel, name) {
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

  isDebug() {
    if (!this.logger) {
      return false
    }
    return this.logger.getLevel() == this.LOG_LEVEL.DEBUG
  }

  info() {
    this.logger.info.apply(null, arguments)
  }

  isInfo() {
    if (!this.logger) {
      return false
    }
    return this.logger.getLevel() == this.LOG_LEVEL.INFO
  }

  warn() {
    this.logger.info.apply(null, arguments)
  }

  error() {
    this.logger.info.apply(null, arguments)
  }
}

module.exports = new Logger()
