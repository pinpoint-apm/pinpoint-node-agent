/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ErrorAnalysisConfigBuilder } = require('../../../lib/context/trace/error-analysis-config-builder')

test('ErrorAnalysisConfigBuilder should return disabled config when no config', (t) => {
    const config = new ErrorAnalysisConfigBuilder({}).build()
    t.equal(config.isErrorAnalysisEnabled(), false, 'should be disabled')
    t.equal(config.getMaxDepth(), 10, 'should return default maxDepth')
    t.end()
})

test('ErrorAnalysisConfigBuilder should return disabled config when enabled is false', (t) => {
    const config = new ErrorAnalysisConfigBuilder({
        features: { errorAnalysis: { enabled: false } }
    }).build()
    t.equal(config.isErrorAnalysisEnabled(), false, 'should be disabled')
    t.end()
})

test('ErrorAnalysisConfigBuilder should return enabled config with defaults', (t) => {
    const config = new ErrorAnalysisConfigBuilder({
        features: { errorAnalysis: {} }
    }).build()
    t.equal(config.isErrorAnalysisEnabled(), true, 'should be enabled')
    t.equal(config.getMaxDepth(), 10, 'default maxDepth is 10')
    t.end()
})

test('ErrorAnalysisConfigBuilder should use custom maxDepth', (t) => {
    const config = new ErrorAnalysisConfigBuilder({
        features: { errorAnalysis: { maxDepth: 5 } }
    }).build()
    t.equal(config.isErrorAnalysisEnabled(), true, 'should be enabled')
    t.equal(config.getMaxDepth(), 5, 'custom maxDepth is 5')
    t.end()
})

test('ErrorAnalysisConfigBuilder should override with env vars', (t) => {
    process.env.PINPOINT_FEATURES_ERROR_ANALYSIS = 'true'
    process.env.PINPOINT_FEATURES_ERROR_ANALYSIS_MAX_DEPTH = '3'

    const config = new ErrorAnalysisConfigBuilder({}).build()
    t.equal(config.isErrorAnalysisEnabled(), true, 'env var enables')
    t.equal(config.getMaxDepth(), 3, 'env var maxDepth is 3')

    delete process.env.PINPOINT_FEATURES_ERROR_ANALYSIS
    delete process.env.PINPOINT_FEATURES_ERROR_ANALYSIS_MAX_DEPTH
    t.end()
})

test('ErrorAnalysisConfigBuilder env var false should disable', (t) => {
    process.env.PINPOINT_FEATURES_ERROR_ANALYSIS = 'false'

    const config = new ErrorAnalysisConfigBuilder({
        features: { errorAnalysis: { maxDepth: 5 } }
    }).build()
    t.equal(config.isErrorAnalysisEnabled(), false, 'env var disables')

    delete process.env.PINPOINT_FEATURES_ERROR_ANALYSIS
    t.end()
})

test('ErrorAnalysisConfigBuilder should fallback invalid maxDepth to default', (t) => {
    const config = new ErrorAnalysisConfigBuilder({
        features: { errorAnalysis: { maxDepth: -1 } }
    }).build()
    t.equal(config.getMaxDepth(), 10, 'invalid maxDepth falls back to 10')
    t.end()
})
