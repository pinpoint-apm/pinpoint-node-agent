/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const LoggerOutputAdaptor = require('../../../lib/utils/log/logger-output-adaptor')

test('Adaptor method duck typing validation', (t) => {
    let actual = new LoggerOutputAdaptor(Object.assign({}, {
        debug: function (message) {
            this.actualMessage = message
        }
    }))
    actual.debug('message')
    t.equal(actual.output.actualMessage, 'message')

    actual = new LoggerOutputAdaptor(Object.assign({}, {
        info: function (message) {
            this.actualMessage = message
        }
    }))
    actual.info('message2')
    t.equal(actual.output.actualMessage, 'message2')

    actual = new LoggerOutputAdaptor(Object.assign({}, {
        warn: function (message) {
            this.actualMessage = message
        }
    }))
    actual.warn('message3')
    t.equal(actual.output.actualMessage, 'message3')

    actual = new LoggerOutputAdaptor(Object.assign({}, {
        error: function (message) {
            this.actualMessage = message
        }
    }))
    actual.error('message4')
    t.equal(actual.output.actualMessage, 'message4')

    t.end()
})

test('error message', (t) => {
    const error = {
        error: function () {
        }
    }
    let actualUnsafe = new LoggerOutputAdaptor(Object.assign({
        debug: function (message) {
            this.debugMessage = message
        }
    }, error))
    actualUnsafe.debug('debug message')
    t.equal(actualUnsafe.output.debugMessage, 'debug message', 'this.output.debug is undefined')

    actualUnsafe = new LoggerOutputAdaptor(Object.assign({
        info: function (message) {
            this.infoMessage = message
        }
    }, error))
    actualUnsafe.info('info message')
    t.equal(actualUnsafe.output.infoMessage, 'info message', 'this.output.info is undefined')

    actualUnsafe = new LoggerOutputAdaptor(Object.assign({
        warn: function (message) {
            this.warnMessage = message
        }
    }, error))
    actualUnsafe.warn('warn message')
    t.equal(actualUnsafe.output.warnMessage, 'warn message', 'this.output.warn is undefined')

    actualUnsafe = new LoggerOutputAdaptor({})
    Object.defineProperty(actualUnsafe, "console", {
        get: function () {
            return {
                error: function (message) {
                    actualUnsafe.errorMessage = message
                }
            }
        }
    })
    actualUnsafe.error('message')
    t.equal(actualUnsafe.errorMessage, 'The Adaptor doesn\'t has the error function.', 'Adaptor function not defined error message')
    t.false(actualUnsafe.output.error, 'this.output.error is undefined')

    t.end()
})

test('error message without error method', (t) => {
    let actual = new LoggerOutputAdaptor({})
    Object.defineProperty(actual, "console", {
        get: function () {
            return {
                error: function (message) {
                    actual.errorMessage = message
                }
            }
        }
    })
    
    actual.debug('debug message')
    t.equal(actual.errorMessage, 'The Adaptor doesn\'t has the debug function.', 'debug console log')

    actual.info('info message')
    t.equal(actual.errorMessage, 'The Adaptor doesn\'t has the info function.', 'info console message')

    actual.warn('warn message')
    t.equal(actual.errorMessage, 'The Adaptor doesn\'t has the warn function.', 'warn console log')

    actual.error('error message')
    t.equal(actual.errorMessage, 'The Adaptor doesn\'t has the error function.', 'error console message')
    t.end()
})