/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const log = require('../../../lib/utils/log/logger')
const LogBuilder = require('../../../lib/utils/log/log-builder')
const { LogLevel } = require('../../../lib/utils/log/log-builder')

test('isDebug', (t) => {
    t.plan(4)
    t.equal(log.isDebug(), false, 'debug null')

    const testLog = log.getLogger(new LogBuilder('test').logLevelDebug().build())
    t.equal(testLog.isDebug(), true, 'debug')
    t.equal(testLog.isInfo(), false, 'info false')

    const testLog2 = log.getLogger(new LogBuilder('test').logLevelInfo().build())
    t.equal(testLog2.isInfo(), false, 'same name logger is not info false')
})

test('isInfo', (t) => {
    t.plan(2)
    const testLog = log.getLogger(new LogBuilder('test1').logLevelInfo().build())
    t.equal(testLog.isInfo(), true, 'info')
    t.equal(testLog.isDebug(), false, 'debug false')
})

test('warn log', (t) => {
    t.plan(1)
    const testLog = log.getLogger(new LogBuilder('test2').logLevelWarn().build())
    t.equal(testLog.loglevel.getLevel(), testLog.loglevel.levels.WARN, 'warn log level')
})

test('error log', (t) => {
    t.plan(1)
    const testLog = log.getLogger(new LogBuilder('test3').logLevelError().build())
    t.equal(testLog.loglevel.getLevel(), testLog.loglevel.levels.ERROR, 'error log level')
})

test('appenders', (t) => {
    t.plan(2)
    const testLog = log.getLogger(new LogBuilder('test4').logLevelDebug().build())
    t.equal(testLog.appenders.length, 0, 'appenders length')

    const validAppender = {
        loggingLevel: LogLevel.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }
    const testLog2 = log.getLogger(new LogBuilder('test5').logLevelDebug().addAppender(validAppender).build())
    t.equal(testLog2.appenders.length, 1, 'appenders length with valid appender')
})

test('addAppender validation', (t) => {
    t.plan(6)

    // Valid appender
    const validAppender = {
        loggingLevel: LogLevel.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithValidAppender = new LogBuilder('test6').addAppender(validAppender).build()
    t.equal(logWithValidAppender.appenders.length, 1, 'Valid appender should be added')

    // Invalid appender - undefined
    const logWithUndefinedAppender = new LogBuilder('test6-undefined').addAppender(undefined).build()
    t.equal(logWithUndefinedAppender.appenders.length, 0, 'undefined appender should be ignored')

    // Invalid appender - null
    const logWithNullAppender = new LogBuilder('test6-null').addAppender(null).build()
    t.equal(logWithNullAppender.appenders.length, 0, 'null appender should be ignored')

    // Invalid appender - missing methods
    const invalidAppender = {
        loggingLevel: LogLevel.DEBUG,
        debug: (msg) => msg
        // missing info, warn, error
    }

    const logWithInvalidAppender = new LogBuilder('test7').addAppender(invalidAppender).build()
    t.equal(logWithInvalidAppender.appenders.length, 0, 'Invalid appender should be ignored')

    // Invalid appender - non-function methods
    const nonFunctionAppender = {
        loggingLevel: LogLevel.DEBUG,
        debug: 'not a function',
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }

    const logWithNonFunctionAppender = new LogBuilder('test8').addAppender(nonFunctionAppender).build()
    t.equal(logWithNonFunctionAppender.appenders.length, 0, 'Non-function methods should be ignored')

    // Mixed valid and invalid appenders
    const mixedLog = new LogBuilder('test9')
        .addAppender(undefined)           // ignored
        .addAppender(invalidAppender)     // ignored
        .addAppender(validAppender)       // added
        .addAppender(nonFunctionAppender) // ignored
        .build()
    t.equal(mixedLog.appenders.length, 1, 'Only valid appenders should be added in mixed scenario')
})

test('formatMessage', (t) => {
    t.plan(4)
    const testLog = log.getLogger(new LogBuilder('test10').logLevelDebug().build())

    // String arguments
    const message1 = testLog.formatMessage(['hello', 'world'])
    t.equal(message1, 'hello world', 'String arguments should be joined with space')

    // Mixed arguments with object
    const obj = { id: 123, name: 'test' }
    const message2 = testLog.formatMessage(['User:', obj, 'logged in'])
    t.equal(message2, 'User: {"id":123,"name":"test"} logged in', 'Object should be JSON stringified')

    // Number arguments
    const message3 = testLog.formatMessage([1, 2, 3])
    t.equal(message3, '1 2 3', 'Numbers should be converted to strings')

    // Circular reference handling
    const circular = { name: 'test' }
    circular.self = circular
    const message4 = testLog.formatMessage(['Circular:', circular])
    t.ok(message4.includes('[Object object]'), 'Circular references should be handled gracefully')
})

test('appender message forwarding', (t) => {
    t.plan(7)

    let capturedMessages = []
    const mockAppender = {
        loggingLevel: LogLevel.DEBUG,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    // Test with DEBUG level (processes all messages)
    const debugLevelLog = log.getLogger(
        new LogBuilder('test11')
            .logLevelDebug()
            .addAppender(mockAppender)
            .build()
    )

    // Test each log level
    debugLevelLog.debug('test', 'debug', { level: 'debug' })
    debugLevelLog.info('test', 'info')
    debugLevelLog.warn('test', 'warn')
    debugLevelLog.error('test', 'error')

    t.equal(capturedMessages.length, 4, 'All messages should be captured at DEBUG level')
    t.ok(capturedMessages[0].includes('DEBUG: test debug'), 'Debug message should be formatted correctly')
    t.ok(capturedMessages[1].includes('INFO: test info'), 'Info message should be formatted correctly')
    t.ok(capturedMessages[3].includes('ERROR: test error'), 'Error message should be formatted correctly')

    // Test with WARN level (only processes WARN and ERROR)
    const warnMockAppender = {
        loggingLevel: LogLevel.WARN,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    const warnLevelLog = log.getLogger(
        new LogBuilder('test11-warn')
            .logLevelWarn()
            .addAppender(warnMockAppender)
            .build()
    )

    capturedMessages = [] // Reset messages
    warnLevelLog.debug('debug message')  // should be filtered out
    warnLevelLog.info('info message')    // should be filtered out
    warnLevelLog.warn('warn message')    // should be processed
    warnLevelLog.error('error message')  // should be processed

    t.equal(capturedMessages.length, 2, 'WARN level should only process WARN and ERROR messages')
    t.ok(capturedMessages[0].includes('WARN: warn message'), 'WARN message should be processed')

    // Test with SILENT level (processes no messages)
    const silentMockAppender = {
        loggingLevel: LogLevel.SILENT,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    const silentLevelLog = log.getLogger(
        new LogBuilder('test11-silent')
            .logLevelSilent()
            .addAppender(silentMockAppender)
            .build()
    )

    capturedMessages = [] // Reset messages
    silentLevelLog.debug('debug message')  // should be filtered out
    silentLevelLog.info('info message')    // should be filtered out
    silentLevelLog.warn('warn message')    // should be filtered out
    silentLevelLog.error('error message')  // should be filtered out

    t.equal(capturedMessages.length, 0, 'SILENT level should process no messages')
})

test('guard clause - no appenders', (t) => {
    t.plan(4)

    // Logger without appenders should not throw when logging
    const testLog = log.getLogger(new LogBuilder('test12').logLevelDebug().build())

    t.doesNotThrow(() => {
        testLog.debug('test message')
        testLog.info('test message')
        testLog.warn('test message')
        testLog.error('test message')
    }, 'Logging without appenders should not throw')

    // Test performance optimization - formatMessage should not be called
    let formatMessageCallCount = 0
    const originalFormatMessage = testLog.formatMessage
    testLog.formatMessage = function(...args) {
        formatMessageCallCount++
        return originalFormatMessage.apply(this, args)
    }

    testLog.debug('debug message')
    testLog.info('info message')
    testLog.warn('warn message')
    testLog.error('error message')

    t.equal(formatMessageCallCount, 0, 'formatMessage should not be called when no appenders')

    // Test log level filtering with appenders
    let errorCallCount = 0
    const mockAppender = {
        loggingLevel: LogLevel.ERROR,
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => { errorCallCount++ }
    }

    const errorLevelLog = log.getLogger(
        new LogBuilder('test12-error')
            .logLevelError()
            .addAppender(mockAppender)
            .build()
    )

    errorCallCount = 0
    errorLevelLog.debug('debug message') // should be filtered by appender level
    errorLevelLog.info('info message')   // should be filtered by appender level
    errorLevelLog.warn('warn message')   // should be filtered by appender level
    errorLevelLog.error('error message') // should be processed

    t.equal(errorCallCount, 1, 'error method should only be called for ERROR level messages')

    // Test SILENT level - should never call any appender methods
    let silentCallCount = 0
    const silentMockAppender = {
        loggingLevel: LogLevel.SILENT,
        debug: () => { silentCallCount++ },
        info: () => { silentCallCount++ },
        warn: () => { silentCallCount++ },
        error: () => { silentCallCount++ }
    }

    const silentLevelLog = log.getLogger(
        new LogBuilder('test12-silent')
            .logLevelSilent()
            .addAppender(silentMockAppender)
            .build()
    )

    silentCallCount = 0
    silentLevelLog.debug('debug message')
    silentLevelLog.info('info message')
    silentLevelLog.warn('warn message')
    silentLevelLog.error('error message')

    t.equal(silentCallCount, 0, 'appender methods should never be called at SILENT level')
})

test('per-appender loggingLevel configuration', (t) => {
    t.plan(6)

    const warnAppenderMessages = []
    const warnAppender = {
        loggingLevel: LogLevel.WARN,
        debug: (msg) => warnAppenderMessages.push(`WARN-APPENDER DEBUG: ${msg}`),
        info: (msg) => warnAppenderMessages.push(`WARN-APPENDER INFO: ${msg}`),
        warn: (msg) => warnAppenderMessages.push(`WARN-APPENDER WARN: ${msg}`),
        error: (msg) => warnAppenderMessages.push(`WARN-APPENDER ERROR: ${msg}`)
    }

    const errorAppenderMessages = []
    const errorAppender = {
        loggingLevel: LogLevel.ERROR,
        debug: (msg) => errorAppenderMessages.push(`ERROR-APPENDER DEBUG: ${msg}`),
        info: (msg) => errorAppenderMessages.push(`ERROR-APPENDER INFO: ${msg}`),
        warn: (msg) => errorAppenderMessages.push(`ERROR-APPENDER WARN: ${msg}`),
        error: (msg) => errorAppenderMessages.push(`ERROR-APPENDER ERROR: ${msg}`)
    }

    // Create logger with different logging levels for each appender
    const mixedLevelLog = log.getLogger(
        new LogBuilder('per-appender-test')
            .logLevelDebug() // Global level is DEBUG to allow all messages
            .addAppender(warnAppender)   // This appender only logs WARN and ERROR
            .addAppender(errorAppender)  // This appender only logs ERROR
            .build()
    )

    // Test all levels
    mixedLevelLog.debug('debug message')
    mixedLevelLog.info('info message')
    mixedLevelLog.warn('warn message')
    mixedLevelLog.error('error message')

    // WARN level appender should only receive WARN and ERROR messages
    t.equal(warnAppenderMessages.length, 2, 'WARN appender should receive 2 messages')
    t.ok(warnAppenderMessages[0].includes('WARN: warn message'), 'WARN appender should receive warn message')
    t.ok(warnAppenderMessages[1].includes('ERROR: error message'), 'WARN appender should receive error message')

    // ERROR level appender should only receive ERROR messages
    t.equal(errorAppenderMessages.length, 1, 'ERROR appender should receive 1 message')
    t.ok(errorAppenderMessages[0].includes('ERROR: error message'), 'ERROR appender should receive error message')

    // Test that appender has loggingLevel property
    const testAppender = {
        loggingLevel: LogLevel.INFO,
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {}
    }
    const testLog = new LogBuilder('property-test')
        .addAppender(testAppender)
        .build()

    t.equal(testLog.getAppenders()[0].loggingLevel, LogLevel.INFO, 'Appender should have loggingLevel property set correctly')
})