/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Logger = require('./utils/log/logger2')

let log = undefined
module.exports = {
   getLog: function () {
      if (log) {
         return log
      }

      if (!log) {
         log = new Logger.NoneBuilder({
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
      return log
   },
   setLog: function(logger) {
      log = logger
   }
}