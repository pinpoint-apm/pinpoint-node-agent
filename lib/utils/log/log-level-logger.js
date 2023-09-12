/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const defaultLog = require('loglevel').getLogger('pinpoint-console-logger')
const Logger = require('./logger2')

module.exports = {
    makeLogLevelLog: function (logLevel) {
        defaultLog.setLevel(Logger.logTypeNameOf(logLevel))
        return Logger.makeBuilder(logLevel, {
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
}