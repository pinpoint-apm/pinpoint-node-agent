/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const loglevel = require('loglevel')
const { LogBuilder, LogLevel: Level, Log } = require('./log-builder')


class Logger {
  constructor() {
    this.loggers = new Map()
    this.defaultLoggerName = LogBuilder.createDefaultLogBuilder().getName()
    this.loggers.set(this.defaultLoggerName, new ChildLogger(loglevel, LogBuilder.createDefaultLogBuilder().build()))
  }

  getLogger(log) {
    if (!log) {
      return this.loggers.get(this.defaultLoggerName)
    }

    if (typeof log === 'string') {
      return this.loggers.get(log) ?? this.loggers.get(this.defaultLoggerName)
    }

    if (!(log instanceof Log)) {
      return this.loggers.get(this.defaultLoggerName)
    }

    const logName = log.getName()
    if (!this.loggers.has(logName)) {
      const logger = new ChildLogger(loglevel.getLogger(logName), log)
      this.loggers.set(logName, logger)
      return logger
    }

    if (log.createdWithConfig()) {
      const logger = this.loggers.get(logName)
      logger.loglevel.setLevel(log.getLevel())
      logger.appenders = log.getAppenders()
    }
    return this.loggers.get(logName)
  }

  debug() {
    const logger = this.getLogger()
    logger.debug.apply(logger, arguments)
  }

  isDebug() {
    const logger = this.getLogger()
    return logger.isDebug()
  }

  info() {
    const logger = this.getLogger()
    logger.info.apply(logger, arguments)
  }

  isInfo() {
    const logger = this.getLogger()
    return logger.isInfo()
  }

  warn() {
    const logger = this.getLogger()
    logger.warn.apply(logger, arguments)
  }

  error() {
    const logger = this.getLogger()
    logger.error.apply(logger, arguments)
  }
}

class ChildLogger {
  constructor(loglevel, log) {
    this.loglevel = loglevel
    this.loglevel.setLevel(log.getLevel())
    this.appenders = log.getAppenders()
    this.name = log.getName()
  }

  debug() {
    this.loglevel.debug.apply(null, arguments)

    if (!this.hasAppenders()) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.DEBUG) {
        appender.debug(message)
      }
    })
  }

  formatMessage(args) {
    if (!args) return ''

    return Array.from(args).map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch (error) {
          return '[Object object]'
        }
      }
      return String(arg)
    }).join(' ')
  }


  isDebug() {
    return this.loglevel.getLevel() === Level.DEBUG
  }

  info() {
    this.loglevel.info.apply(null, arguments)

    if (!this.hasAppenders()) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.INFO) {
        appender.info(message)
      }
    })
  }

  isInfo() {
    return this.loglevel.getLevel() === Level.INFO
  }

  warn() {
    this.loglevel.warn.apply(null, arguments)

    if (!this.hasAppenders()) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.WARN) {
        appender.warn(message)
      }
    })
  }

  error() {
    this.loglevel.error.apply(null, arguments)

    if (!this.hasAppenders()) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.ERROR) {
        appender.error(message)
      }
    })
  }

  hasAppenders() {
    return Array.isArray(this.appenders) && this.appenders.length > 0
  }
}

module.exports = new Logger()