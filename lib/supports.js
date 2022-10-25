/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Logger = require('./utils/log/logger2')
const { getConfig, needsLoadConfig } = require('./config')
const defaultLog = require('loglevel').getLogger('default_logger')

let log = undefined
module.exports = {
   getLog: function () {
      if (log) {
         return log
      }

      if (needsLoadConfig()) {
         return new Logger.NoneBuilder({
            output: console,
            debug: function (message) {
               this.output.debug(message)
            },
            info: function (message) {
               this.output.info(message)
            },
            warn: function (message) {
               this.output.warn(message)
            },
            error: function (message) {
               this.output.error(message)
            }
         }).build()
      }

      const config = getConfig()
      if (!log) {
         defaultLog.setLevel(Logger.logTypeNameOf(config.logLevel))
         log = Logger.makeBuilder(config.logLevel, {
            log: defaultLog,
            debug: function (message) {
               this.log.debug(message)
            },
            info: function (message) {
               this.log.info(message)
            },
            warn: function (message) {
               this.log.warn(message)
            },
            error: function (message) {
               this.log.error(message)
            }
         }).build()
      }
      return log
   },
   clearLog: function () {
      log = undefined
   }
}