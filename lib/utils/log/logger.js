/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const loglevel = require('loglevel')
const { LogBuilder, LogLevel: Level, Log } = require('./log-builder')

class Logging {
  constructor(loglevel, log) {
    this.loglevel = loglevel
    if (log) {
      this.loglevel.setLevel(log.getLevel())
      this.appenders = log.getAppenders()
    } else {
      this.appenders = []
    }
    this.name = log.getName()
  }

  debug() {
    this.loglevel.debug.apply(null, arguments)

    if (this.appenders.length < 1) return

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

    if (this.appenders.length < 1) return

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

    if (this.appenders.length < 1) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.WARN) {
        appender.warn(message)
      }
    })
  }

  error() {
    this.loglevel.error.apply(null, arguments)

    if (this.appenders.length < 1) return

    const message = this.formatMessage(arguments)
    this.appenders.forEach(appender => {
      if (appender.loggingLevel <= Level.ERROR) {
        appender.error(message)
      }
    })
  }
}

class Logger extends Logging {
  constructor() {
    super(loglevel, LogBuilder.createDefaultLogBuilder().build())
    this.loggers = new Map()
  }

  getLogger(log) {
    if (!(log instanceof Log) && typeof log !== 'string') {
      return this
    }

    if (typeof log === 'string' && !this.loggers.has(log)) {
      return this
    }

    const logName = log.getName?.() ?? (typeof log === 'string' ? log : LogBuilder.createDefaultLogBuilder().build().getName())
    if (!this.loggers.has(logName)) {
      this.loggers.set(logName, new ChildLogger(this.loglevel.getLogger(logName), log))
    }
    return this.loggers.get(logName)
  }

  setRootLogger(log) {
    this.loglevel.setLevel(log.getLevel())
    this.appenders = log.getAppenders()
  }
}

class ChildLogger extends Logging {
  constructor(loglevel, log) {
    super(loglevel, log)
    this.name = log.getName()
  }
}

module.exports = new Logger()