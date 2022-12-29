/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const test = require('tape')
const { getLog, setLog } = require('../../../lib/supports')
const Agent = require('../../../lib/agent')
const { clear, getConfig } = require('../../../lib/config')

test('no config logger', (t) => {
    clear()
    setLog(null)
    const actual = getLog()
    new Agent()
    t.equal(actual.adaptor.constructor.name, 'LoggerOutputAdaptor', 'log adaptor')
    t.equal(actual.type.name, 'NONE', 'when first loading time, log type is NONE')

    actual.adaptor.output.output = {
        debug: function (message) {
            this.debugMessage = message
        },
        info: function (message) {
            this.infoMessage = message
        },
        warn: function (message) {
            this.warnMessage = message
        },
        error: function (message) {
            this.errorMessage = message
        }
    }
    actual.debug('a debug message')
    actual.info('a info message')
    actual.warn('a warn message')
    actual.error('a error message')
    t.equal(actual.adaptor.output.output.debugMessage, 'a debug message', 'debug queue message')
    t.equal(actual.adaptor.output.output.infoMessage, 'a info message', 'info queue message')
    t.equal(actual.adaptor.output.output.warnMessage, 'a warn message', 'warn queue message')
    t.equal(actual.adaptor.output.output.errorMessage, 'a error message', 'error queue message')
    t.end()
})

test('logger full cycle', (t) => {
    clear()
    setLog(null)
    let actual = getLog()
    t.true(actual.adaptor.output.output === console, 'when no configuration loaded, logs use console output')
    getConfig()

    actual = getLog()
    t.equal(actual.adaptor.output.log.constructor.name, 'Logger', 'default logger use LogLevel')
    t.equal(actual.adaptor.output.log.getLevel(), 3, 'configuration log level from pinpoint-node-agent.json')
    t.end()
})