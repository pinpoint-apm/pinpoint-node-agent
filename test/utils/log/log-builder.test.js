/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { LogBuilder, LogLevel } = require('../../../lib/utils/log/log-builder')
const levels = LogLevel

test('no config logs clone appenders array', (t) => {
    t.plan(3)

    const builder = new LogBuilder('no-config-appenders')
    const firstAppender = {
        name: 'first-appender',
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    builder.addAppender(firstAppender)

    const initialLog = builder.build()

    t.equal(initialLog.getAppenders().length, 1, 'no config log should include existing appenders')

    const secondAppender = {
        name: 'second-appender',
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    builder.addAppender(secondAppender)
    const refreshedLog = builder.build()

    t.equal(initialLog.getAppenders().length, 1, 'modifying builder appenders should not affect existing no config log')
    t.equal(refreshedLog.getAppenders().length, 2, 'subsequent builds should reflect new appenders')
})

test('addAppender validation', (t) => {
    t.plan(8)

    const validAppender = {
        name: 'console',
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithValidAppender = new LogBuilder('test6').addAppender(validAppender).build()
    t.equal(logWithValidAppender.appenders.length, 1, 'Valid appender should be added')

    const logWithUndefinedAppender = new LogBuilder('test6-undefined').addAppender(undefined).build()
    t.equal(logWithUndefinedAppender.appenders.length, 0, 'undefined appender should be ignored')

    const logWithNullAppender = new LogBuilder('test6-null').addAppender(null).build()
    t.equal(logWithNullAppender.appenders.length, 0, 'null appender should be ignored')

    const invalidAppender = {
        name: 'invalid',
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg
    }

    const logWithInvalidAppender = new LogBuilder('test7').addAppender(invalidAppender).build()
    t.equal(logWithInvalidAppender.appenders.length, 0, 'Invalid appender should be ignored')

    const nonFunctionAppender = {
        name: 'non-function',
        loggingLevel: levels.DEBUG,
        debug: 'not a function',
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithNonFunctionAppender = new LogBuilder('test8').addAppender(nonFunctionAppender).build()
    t.equal(logWithNonFunctionAppender.appenders.length, 0, 'Non-function methods should be ignored')

    const noNameAppender = {
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithNoNameAppender = new LogBuilder('test8-noname').addAppender(noNameAppender).build()
    t.equal(logWithNoNameAppender.appenders.length, 0, 'Appender without name should be ignored')

    const nonStringNameAppender = {
        name: 123,
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithNonStringNameAppender = new LogBuilder('test8-nonstring').addAppender(nonStringNameAppender).build()
    t.equal(logWithNonStringNameAppender.appenders.length, 0, 'Appender with non-string name should be ignored')

    const mixedLog = new LogBuilder('test9')
        .addAppender(undefined)
        .addAppender(invalidAppender)
        .addAppender(validAppender)
        .addAppender(nonFunctionAppender)
        .build()
    t.equal(mixedLog.appenders.length, 1, 'Only valid appenders should be added in mixed scenario')
})

test('appender loggingLevel property', (t) => {
    t.plan(1)

    const testAppender = {
        name: 'property-test-appender',
        loggingLevel: levels.INFO,
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: () => { }
    }
    const testLog = new LogBuilder('property-test')
        .addAppender(testAppender)
        .build()

    t.equal(testLog.getAppenders()[0].loggingLevel, levels.INFO, 'Appender should have loggingLevel property set correctly')
})
