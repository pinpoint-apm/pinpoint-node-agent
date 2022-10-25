/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const LoggerOutputAdaptor = require('./logger-output-adaptor')

class Logger {

  constructor(type, adaptor) {
    this.type = type
    this.adaptor = new LoggerOutputAdaptor(adaptor)
  }

  static get DebugBuilder() {
    return Logger.Builder(LogType.debug)
  }

  static Builder(type) {
    return class Builder {
      constructor(adaptor) {
        this.type = type
        this.adaptor = adaptor
      }

      build() {
        return new Logger(this.type, this.adaptor)
      }
    }
  }

  static get InfoBuilder() {
    return Logger.Builder(LogType.info)
  }

  static get WarnBuilder() {
    return Logger.Builder(LogType.warn)
  }

  static get ErrorBuilder() {
    return Logger.Builder(LogType.error)
  }

  static get NoneBuilder() {
    return Logger.Builder(LogType.noneConfig)
  }

  static makeBuilder(name, adaptor) {
    return new (Logger.Builder(LogType.valueOf(name)))(adaptor)
  }

  debug(message) {
    this.adaptor.debug(message)
  }

  isDebug() {
    return this.type.isDebug()
  }

  info(message) {
    this.adaptor.info(message)
  }

  isInfo() {
    return this.type.isInfo()
  }

  warn(message) {
    this.adaptor.warn(message)
  }

  error(message) {
    this.adaptor.error(message)
  }
}

class LogType {

  static get debug() {
    return new LogType('DEBUG')
  }

  static get info() {
    return new LogType('INFO')
  }

  static get warn() {
    return new LogType('WARN')
  }

  static get error() {
    return new LogType('ERROR')
  }

  static get noneConfig() {
    return new LogType('NONE')
  }

  static valueOf(name) {
    if (name.toUpperCase) {
      name = name.toUpperCase()
    }
    const type = [this.debug, this.info, this.warn, this.error].find(element => element.name === name)
    if (!type) {
      return this.noneConfig
    }

    return type
  }

  constructor(name) {
    this.name = name
  }

  isDebug() {
    return this.name === LogType.debug.name
  }

  isInfo() {
    return this.name === LogType.info.name
  }
}


module.exports = Logger
