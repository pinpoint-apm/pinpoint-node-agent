/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const logger = require('../../lib/utils/log/logger')
const { LogBuilder, LogLevel } = require('../../lib/utils/log/log-builder')
const { ConfigBuilder } = require('../../lib/config-builder')
const { initializeLogger, logError } = require('../../lib/client/grpc-errors')

test('logError should not dispatch to appender when grpcLogger is SILENT', (t) => {
    const config = new ConfigBuilder({
        applicationName: 'test-silent',
        features: {
            logLevels: {
                'grpcLogger': 'SILENT'
            }
        }
    }).build()

    let appendCallCount = 0
    const capturingAppender = {
        name: 'grpc-silent-test',
        loggingLevel: LogLevel.SILENT,
        debug: () => { appendCallCount++ },
        info: () => { appendCallCount++ },
        warn: () => { appendCallCount++ },
        error: () => { appendCallCount++ }
    }

    const grpcLog = logger.getLogger(
        LogBuilder.createGrpcLogBuilder()
            .setConfig(config)
            .addAppender(capturingAppender)
            .build()
    )
    initializeLogger(grpcLog)

    t.equal(grpcLog.loglevel.getLevel(), LogLevel.SILENT, 'grpcLogger level should be SILENT')

    let errorCallCount = 0
    const originalError = grpcLog.error.bind(grpcLog)
    grpcLog.error = function () {
        errorCallCount++
        originalError.apply(null, arguments)
    }

    t.teardown(() => {
        grpcLog.error = originalError
    })

    logError('deadline test', { code: grpc.status.DEADLINE_EXCEEDED })
    logError('cancelled test', { code: grpc.status.CANCELLED })
    logError('unavailable test', { code: grpc.status.UNAVAILABLE })
    logError('generic test', { code: 999, message: 'unknown' })

    t.equal(errorCallCount, 4, 'initializeLogger injected logger should be used for all logError calls')
    t.equal(appendCallCount, 0, 'SILENT grpcLogger should not dispatch any logs to appender')
    t.end()
})

test('logError should skip when error is null or undefined', (t) => {
    logError('no error', null)
    logError('no error', undefined)
    t.pass('logError should not throw when error is null/undefined')
    t.end()
})
