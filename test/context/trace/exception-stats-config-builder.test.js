/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ExceptionStatsConfigBuilder } = require('../../../lib/context/trace/exception-stats-config-builder')

test('ExceptionStatsConfigBuilder should return DisableExceptionStatsConfig when no config', (t) => {
    const config = new ExceptionStatsConfigBuilder({}).build()
    t.equal(config.isExceptionStatsEnabled(), false, 'should be disabled')
    t.equal(config.getMaxDepth(), 10, 'should return default maxDepth')
    t.end()
})

test('ExceptionStatsConfigBuilder should return DisableExceptionStatsConfig when enabled is false', (t) => {
    const config = new ExceptionStatsConfigBuilder({
        features: { exceptionStats: { enabled: false } }
    }).build()
    t.equal(config.isExceptionStatsEnabled(), false, 'should be disabled')
    t.end()
})

test('ExceptionStatsConfigBuilder should return enabled config with defaults', (t) => {
    const config = new ExceptionStatsConfigBuilder({
        features: { exceptionStats: {} }
    }).build()
    t.equal(config.isExceptionStatsEnabled(), true, 'should be enabled')
    t.equal(config.getMaxDepth(), 10, 'default maxDepth is 10')
    t.end()
})

test('ExceptionStatsConfigBuilder should use custom maxDepth', (t) => {
    const config = new ExceptionStatsConfigBuilder({
        features: { exceptionStats: { maxDepth: 5 } }
    }).build()
    t.equal(config.isExceptionStatsEnabled(), true, 'should be enabled')
    t.equal(config.getMaxDepth(), 5, 'custom maxDepth is 5')
    t.end()
})

test('ExceptionStatsConfigBuilder should override with env vars', (t) => {
    process.env.PINPOINT_FEATURES_EXCEPTION_STATS = 'true'
    process.env.PINPOINT_FEATURES_EXCEPTION_STATS_MAX_DEPTH = '3'

    const config = new ExceptionStatsConfigBuilder({}).build()
    t.equal(config.isExceptionStatsEnabled(), true, 'env var enables')
    t.equal(config.getMaxDepth(), 3, 'env var maxDepth is 3')

    delete process.env.PINPOINT_FEATURES_EXCEPTION_STATS
    delete process.env.PINPOINT_FEATURES_EXCEPTION_STATS_MAX_DEPTH
    t.end()
})

test('ExceptionStatsConfigBuilder env var false should disable', (t) => {
    process.env.PINPOINT_FEATURES_EXCEPTION_STATS = 'false'

    const config = new ExceptionStatsConfigBuilder({
        features: { exceptionStats: { maxDepth: 5 } }
    }).build()
    t.equal(config.isExceptionStatsEnabled(), false, 'env var disables')

    delete process.env.PINPOINT_FEATURES_EXCEPTION_STATS
    t.end()
})

test('ExceptionStatsConfigBuilder should fallback invalid maxDepth to default', (t) => {
    const config = new ExceptionStatsConfigBuilder({
        features: { exceptionStats: { maxDepth: -1 } }
    }).build()
    t.equal(config.getMaxDepth(), 10, 'invalid maxDepth falls back to 10')
    t.end()
})
