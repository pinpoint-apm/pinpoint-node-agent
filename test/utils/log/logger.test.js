/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const logger = require('../../../lib/utils/log/logger')
const { LogBuilder, LogLevel } = require('../../../lib/utils/log/log-builder')
const levels = LogLevel

test('isDebug', (t) => {
    t.plan(4)
    t.equal(logger.isDebug(), false, 'debug null')

    const testLog = logger.getLogger(new LogBuilder('test').logLevelDebug().build())
    t.equal(testLog.isDebug(), true, 'debug')
    t.equal(testLog.isInfo(), false, 'info false')

    const testLog2 = logger.getLogger(new LogBuilder('test').logLevelInfo().build())
    t.equal(testLog2.isInfo(), false, 'same name logger is not info false')
})

test('isInfo', (t) => {
    t.plan(2)
    const testLog = logger.getLogger(new LogBuilder('test1').logLevelInfo().build())
    t.equal(testLog.isInfo(), true, 'info')
    t.equal(testLog.isDebug(), false, 'debug false')
})

test('warn log', (t) => {
    t.plan(1)
    const testLog = logger.getLogger(new LogBuilder('test2').logLevelWarn().build())
    t.equal(testLog.loglevel.getLevel(), testLog.loglevel.levels.WARN, 'warn log level')
})

test('error log', (t) => {
    t.plan(1)
    const testLog = logger.getLogger(new LogBuilder('test3').logLevelError().build())
    t.equal(testLog.loglevel.getLevel(), testLog.loglevel.levels.ERROR, 'error log level')
})

test('appenders', (t) => {
    t.plan(2)
    const testLog = logger.getLogger(new LogBuilder('test4').logLevelDebug().build())
    t.equal(testLog.appenders.length, 0, 'appenders length')

    const validAppender = {
        name: 'test-appender',
        loggingLevel: levels.DEBUG,
        debug: (msg) => msg,
        info: (msg) => msg,
        warn: (msg) => msg,
        error: (msg) => msg
    }
    const testLog2 = logger.getLogger(new LogBuilder('test5').logLevelDebug().addAppender(validAppender).build())
    t.equal(testLog2.appenders.length, 1, 'appenders length with valid appender')
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

test('formatMessage', (t) => {
    t.plan(4)
    const testLog = logger.getLogger(new LogBuilder('test10').logLevelDebug().build())

    const message1 = testLog.formatMessage(['hello', 'world'])
    t.equal(message1, 'hello world', 'String arguments should be joined with space')

    const obj = { id: 123, name: 'test' }
    const message2 = testLog.formatMessage(['User:', obj, 'logged in'])
    t.equal(message2, 'User: {"id":123,"name":"test"} logged in', 'Object should be JSON stringified')

    const message3 = testLog.formatMessage([1, 2, 3])
    t.equal(message3, '1 2 3', 'Numbers should be converted to strings')

    const circular = { name: 'test' }
    circular.self = circular
    const message4 = testLog.formatMessage(['Circular:', circular])
    t.ok(message4.includes('[Object object]'), 'Circular references should be handled gracefully')
})

test('appender message forwarding', (t) => {
    t.plan(7)

    let capturedMessages = []
    const mockAppender = {
        name: 'mock-appender',
        loggingLevel: levels.DEBUG,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    const debugLevelLog = logger.getLogger(
        new LogBuilder('test11')
            .logLevelDebug()
            .addAppender(mockAppender)
            .build()
    )

    debugLevelLog.debug('test', 'debug', { level: 'debug' })
    debugLevelLog.info('test', 'info')
    debugLevelLog.warn('test', 'warn')
    debugLevelLog.error('test', 'error')

    t.equal(capturedMessages.length, 4, 'All messages should be captured at DEBUG level')
    t.ok(capturedMessages[0].includes('DEBUG: test debug'), 'Debug message should be formatted correctly')
    t.ok(capturedMessages[1].includes('INFO: test info'), 'Info message should be formatted correctly')
    t.ok(capturedMessages[3].includes('ERROR: test error'), 'Error message should be formatted correctly')

    const warnMockAppender = {
        name: 'warn-mock-appender',
        loggingLevel: levels.WARN,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    const warnLevelLog = logger.getLogger(
        new LogBuilder('test11-warn')
            .logLevelWarn()
            .addAppender(warnMockAppender)
            .build()
    )

    capturedMessages = []
    warnLevelLog.debug('debug message')
    warnLevelLog.info('info message')
    warnLevelLog.warn('warn message')
    warnLevelLog.error('error message')

    t.equal(capturedMessages.length, 2, 'WARN level should only process WARN and ERROR messages')
    t.ok(capturedMessages[0].includes('WARN: warn message'), 'WARN message should be processed')

    const silentMockAppender = {
        name: 'silent-mock-appender',
        loggingLevel: levels.SILENT,
        debug: (msg) => capturedMessages.push(`DEBUG: ${msg}`),
        info: (msg) => capturedMessages.push(`INFO: ${msg}`),
        warn: (msg) => capturedMessages.push(`WARN: ${msg}`),
        error: (msg) => capturedMessages.push(`ERROR: ${msg}`)
    }

    const silentLevelLog = logger.getLogger(
        new LogBuilder('test11-silent')
            .logLevelSilent()
            .addAppender(silentMockAppender)
            .build()
    )

    capturedMessages = []
    silentLevelLog.debug('debug message')
    silentLevelLog.info('info message')
    silentLevelLog.warn('warn message')
    silentLevelLog.error('error message')

    t.equal(capturedMessages.length, 0, 'SILENT level should process no messages')
})

test('guard clause - no appenders', (t) => {
    t.plan(4)

    const testLog = logger.getLogger(new LogBuilder('test12').logLevelDebug().build())

    t.doesNotThrow(() => {
        testLog.debug('test message')
        testLog.info('test message')
        testLog.warn('test message')
        testLog.error('test message')
    }, 'Logging without appenders should not throw')

    let formatMessageCallCount = 0
    const originalFormatMessage = testLog.formatMessage
    testLog.formatMessage = function (...args) {
        formatMessageCallCount++
        return originalFormatMessage.apply(this, args)
    }

    testLog.debug('debug message')
    testLog.info('info message')
    testLog.warn('warn message')
    testLog.error('error message')

    t.equal(formatMessageCallCount, 0, 'formatMessage should not be called when no appenders')

    let errorCallCount = 0
    const mockAppender = {
        name: 'error-level-appender',
        loggingLevel: levels.ERROR,
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: () => { errorCallCount++ }
    }

    const errorLevelLog = logger.getLogger(
        new LogBuilder('test12-error')
            .logLevelError()
            .addAppender(mockAppender)
            .build()
    )

    errorCallCount = 0
    errorLevelLog.debug('debug message')
    errorLevelLog.info('info message')
    errorLevelLog.warn('warn message')
    errorLevelLog.error('error message')

    t.equal(errorCallCount, 1, 'error method should only be called for ERROR level messages')

    let silentCallCount = 0
    const silentMockAppender = {
        name: 'silent-level-appender',
        loggingLevel: levels.SILENT,
        debug: () => { silentCallCount++ },
        info: () => { silentCallCount++ },
        warn: () => { silentCallCount++ },
        error: () => { silentCallCount++ }
    }

    const silentLevelLog = logger.getLogger(
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
        name: 'warn-appender',
        loggingLevel: levels.WARN,
        debug: (msg) => warnAppenderMessages.push(`WARN-APPENDER DEBUG: ${msg}`),
        info: (msg) => warnAppenderMessages.push(`WARN-APPENDER INFO: ${msg}`),
        warn: (msg) => warnAppenderMessages.push(`WARN-APPENDER WARN: ${msg}`),
        error: (msg) => warnAppenderMessages.push(`WARN-APPENDER ERROR: ${msg}`)
    }

    const errorAppenderMessages = []
    const errorAppender = {
        name: 'error-appender',
        loggingLevel: levels.ERROR,
        debug: (msg) => errorAppenderMessages.push(`ERROR-APPENDER DEBUG: ${msg}`),
        info: (msg) => errorAppenderMessages.push(`ERROR-APPENDER INFO: ${msg}`),
        warn: (msg) => errorAppenderMessages.push(`ERROR-APPENDER WARN: ${msg}`),
        error: (msg) => errorAppenderMessages.push(`ERROR-APPENDER ERROR: ${msg}`)
    }

    const mixedLevelLog = logger.getLogger(
        new LogBuilder('per-appender-test')
            .logLevelDebug()
            .addAppender(warnAppender)
            .addAppender(errorAppender)
            .build()
    )

    mixedLevelLog.debug('debug message')
    mixedLevelLog.info('info message')
    mixedLevelLog.warn('warn message')
    mixedLevelLog.error('error message')

    t.equal(warnAppenderMessages.length, 2, 'WARN appender should receive 2 messages')
    t.ok(warnAppenderMessages[0].includes('WARN: warn message'), 'WARN appender should receive warn message')
    t.ok(warnAppenderMessages[1].includes('ERROR: error message'), 'WARN appender should receive error message')

    t.equal(errorAppenderMessages.length, 1, 'ERROR appender should receive 1 message')
    t.ok(errorAppenderMessages[0].includes('ERROR: error message'), 'ERROR appender should receive error message')

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

test('PINPOINT_LOGGER_LEVELS environment variable log levels', (t) => {
    t.plan(30)
    const config = require('../../../lib/config')
    config.clear()
    process.env['PINPOINT_LOGGER_LEVELS'] = 'default-logger=WARN,.debug-appender=DEBUG,grpc.info-appender=DEBUG,.noLevelAppender=INFO,grpc=INFO'

    const infoAppenderMessages = []
    const infoAppender = {
        name: 'info-appender',
        loggingLevel: levels.INFO,
        debug: (msg) => infoAppenderMessages.push(`INFO-APPENDER DEBUG: ${msg}`),
        info: (msg) => infoAppenderMessages.push(`INFO-APPENDER INFO: ${msg}`),
        warn: (msg) => infoAppenderMessages.push(`INFO-APPENDER WARN: ${msg}`),
        error: (msg) => infoAppenderMessages.push(`INFO-APPENDER ERROR: ${msg}`)
    }

    const noLevelAppenderMessages = []
    const noLevelAppender = {
        name: 'noLevelAppender',
        debug: (msg) => noLevelAppenderMessages.push(`NO-LEVEL-APPENDER DEBUG: ${msg}`),
        info: (msg) => noLevelAppenderMessages.push(`NO-LEVEL-APPENDER INFO: ${msg}`),
        warn: (msg) => noLevelAppenderMessages.push(`NO-LEVEL-APPENDER WARN: ${msg}`),
        error: (msg) => noLevelAppenderMessages.push(`NO-LEVEL-APPENDER ERROR: ${msg}`)
    }

    const noLevelAppenderMessages2 = []
    const noLevelAppender2 = {
        name: 'noLevelAppender2',
        debug: (msg) => noLevelAppenderMessages2.push(`NO-LEVEL-APPENDER2 DEBUG: ${msg}`),
        info: (msg) => noLevelAppenderMessages2.push(`NO-LEVEL-APPENDER2 INFO: ${msg}`),
        warn: (msg) => noLevelAppenderMessages2.push(`NO-LEVEL-APPENDER2 WARN: ${msg}`),
        error: (msg) => noLevelAppenderMessages2.push(`NO-LEVEL-APPENDER2 ERROR: ${msg}`)
    }

    const debugAppenderMessages = []
    const debugAppender = {
        name: 'debug-appender',
        loggingLevel: levels.DEBUG,
        debug: (msg) => debugAppenderMessages.push(`DEBUG-APPENDER DEBUG: ${msg}`),
        info: (msg) => debugAppenderMessages.push(`DEBUG-APPENDER INFO: ${msg}`),
        warn: (msg) => debugAppenderMessages.push(`DEBUG-APPENDER WARN: ${msg}`),
        error: (msg) => debugAppenderMessages.push(`DEBUG-APPENDER ERROR: ${msg}`)
    }

    const confWithAppender = config.getConfig()
    logger.getLogger(LogBuilder.createDefaultLogBuilder()
        .setConfig(confWithAppender)
        .addAppender(infoAppender)
        .addAppender(debugAppender)
        .addAppender(noLevelAppender)
        .addAppender(noLevelAppender2)
        .build())

    const grpcLogger = logger.getLogger(
        new LogBuilder('grpc')
            .setConfig(confWithAppender)
            .addAppender(infoAppender)
            .addAppender(debugAppender)
            .addAppender(noLevelAppender)
            .addAppender(noLevelAppender2)
            .build()
    )

    logger.debug('debug message')
    logger.info('info message')
    logger.warn('warn message')
    logger.error('error message')

    grpcLogger.debug('debug message')
    grpcLogger.info('info message')
    grpcLogger.warn('warn message')
    grpcLogger.error('error message')

    t.equal(infoAppenderMessages.length, 7, 'INFO appender should receive all messages')
    t.ok(infoAppenderMessages[0].includes('INFO-APPENDER INFO: info message'), 'INFO appender should receive info message')
    t.ok(infoAppenderMessages[1].includes('INFO-APPENDER WARN: warn message'), 'INFO appender should receive warn message')
    t.ok(infoAppenderMessages[2].includes('INFO-APPENDER ERROR: error message'), 'INFO appender should receive error message')
    t.ok(infoAppenderMessages[3].includes('INFO-APPENDER DEBUG: debug message'), 'INFO appender should receive from grpc debug message')
    t.ok(infoAppenderMessages[4].includes('INFO-APPENDER INFO: info message'), 'INFO appender should receive info message from grpc logger')
    t.ok(infoAppenderMessages[5].includes('INFO-APPENDER WARN: warn message'), 'INFO appender should receive warn message from grpc logger')
    t.ok(infoAppenderMessages[6].includes('INFO-APPENDER ERROR: error message'), 'INFO appender should receive error message from grpc logger')

    t.equal(debugAppenderMessages.length, 8, 'DEBUG appender should only receive DEBUG messages')
    t.ok(debugAppenderMessages[0].includes('DEBUG-APPENDER DEBUG: debug message'), 'DEBUG appender should receive debug message')
    t.ok(debugAppenderMessages[1].includes('DEBUG-APPENDER INFO: info message'), 'DEBUG appender should receive info message')
    t.ok(debugAppenderMessages[2].includes('DEBUG-APPENDER WARN: warn message'), 'DEBUG appender should receive warn message')
    t.ok(debugAppenderMessages[3].includes('DEBUG-APPENDER ERROR: error message'), 'DEBUG appender should receive error message')
    t.ok(debugAppenderMessages[4].includes('DEBUG-APPENDER DEBUG: debug message'), 'DEBUG appender should receive debug message from grpc logger')
    t.ok(debugAppenderMessages[5].includes('DEBUG-APPENDER INFO: info message'), 'DEBUG appender should receive info message from grpc logger')
    t.ok(debugAppenderMessages[6].includes('DEBUG-APPENDER WARN: warn message'), 'DEBUG appender should receive warn message from grpc logger')
    t.ok(debugAppenderMessages[7].includes('DEBUG-APPENDER ERROR: error message'), 'DEBUG appender should receive error message from grpc logger')

    t.equal(noLevelAppenderMessages.length, 6, 'NO-LEVEL appender should receive INFO, WARN, ERROR messages')
    t.ok(noLevelAppenderMessages[0].includes('NO-LEVEL-APPENDER INFO: info message'), 'NO-LEVEL appender should receive info message')
    t.ok(noLevelAppenderMessages[1].includes('NO-LEVEL-APPENDER WARN: warn message'), 'NO-LEVEL appender should receive warn message')
    t.ok(noLevelAppenderMessages[2].includes('NO-LEVEL-APPENDER ERROR: error message'), 'NO-LEVEL appender should receive error message')
    t.ok(noLevelAppenderMessages[3].includes('NO-LEVEL-APPENDER INFO: info message'), 'NO-LEVEL appender should receive info message from grpc logger')
    t.ok(noLevelAppenderMessages[4].includes('NO-LEVEL-APPENDER WARN: warn message'), 'NO-LEVEL appender should receive warn message from grpc logger')
    t.ok(noLevelAppenderMessages[5].includes('NO-LEVEL-APPENDER ERROR: error message'), 'NO-LEVEL appender should receive error message from grpc logger')

    t.equal(noLevelAppenderMessages2.length, 5, 'NO-LEVEL appender 2 should receive INFO, WARN, ERROR messages')
    t.ok(noLevelAppenderMessages2[0].includes('NO-LEVEL-APPENDER2 WARN: warn message'), 'NO-LEVEL appender 2 should receive warn message')
    t.ok(noLevelAppenderMessages2[1].includes('NO-LEVEL-APPENDER2 ERROR: error message'), 'NO-LEVEL appender 2 should receive error message')
    t.ok(noLevelAppenderMessages2[2].includes('NO-LEVEL-APPENDER2 INFO: info message'), 'NO-LEVEL appender 2 should receive info message from grpc logger')
    t.ok(noLevelAppenderMessages2[3].includes('NO-LEVEL-APPENDER2 WARN: warn message'), 'NO-LEVEL appender 2 should receive warn message from grpc logger')
    t.ok(noLevelAppenderMessages2[4].includes('NO-LEVEL-APPENDER2 ERROR: error message'), 'NO-LEVEL appender 2 should receive error message from grpc logger')
})

test('getLogger with string parameter should return existing logger', (t) => {
    t.plan(4)

    // Create a logger with LogBuilder first
    const logName = 'test-string-logger'
    const originalLogger = logger.getLogger(new LogBuilder(logName).logLevelDebug().build())

    // Get logger with string parameter - should return the existing logger
    const stringLogger = logger.getLogger(logName)

    t.equal(stringLogger, originalLogger, 'getLogger with string should return the same instance')
    t.equal(stringLogger.name, logName, 'Logger name should match')

    // Test with another logger to ensure it works for multiple loggers
    const logName2 = 'test-string-logger-2'
    const originalLogger2 = logger.getLogger(new LogBuilder(logName2).logLevelInfo().build())
    const stringLogger2 = logger.getLogger(logName2)

    t.equal(stringLogger2, originalLogger2, 'getLogger with string should return the same instance for second logger')
    t.equal(stringLogger2.name, logName2, 'Second logger name should match')
})

test('getLogger with string parameter for non-existing logger', (t) => {
    t.plan(2)

    // Try to get a logger that doesn't exist with string parameter
    const nonExistentLogName = 'non-existent-logger'
    const noExistentLogger = logger.getLogger(nonExistentLogName)

    t.ok(noExistentLogger, 'Logger should be created even if it did not exist before')
    t.equal(noExistentLogger.name, 'default-logger', 'Logger should have default name since it was created without LogBuilder')
})

test('getLogger caching behavior with string and LogBuilder', (t) => {
    t.plan(3)

    const logName = 'cache-test-logger'

    // First, get logger with string (non-existing)
    const firstLogger = logger.getLogger(logName)

    // Then, get logger with LogBuilder with same name
    const secondLogger = logger.getLogger(new LogBuilder(logName).logLevelWarn().build())

    // Then, get logger with string again
    const thirdLogger = logger.getLogger(logName)

    // All should be the same instance due to caching
    t.notEqual(firstLogger, secondLogger, 'Logger is different instances when no created with LogBuilder first')
    t.equal(secondLogger, thirdLogger, 'Logger obtained again with string should be the same instance')
    t.equal(firstLogger.name, 'default-logger', 'Logger is not created with LogBuilder first has default name')
})