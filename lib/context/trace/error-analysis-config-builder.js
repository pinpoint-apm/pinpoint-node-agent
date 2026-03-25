/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfBoolean, valueOfNumber } = require('../../config-builder')

class ErrorAnalysisConfig {
    constructor(config) {
        Object.assign(this, config)
    }

    isErrorAnalysisEnabled() {
        return true
    }

    getMaxDepth() {
        return this.maxDepth ?? 10
    }
}

class DisableErrorAnalysisConfig {
    isErrorAnalysisEnabled() {
        return false
    }

    getMaxDepth() {
        return 10
    }
}

class ErrorAnalysisConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const envErrorAnalysis = {
            enabled: valueOfBoolean('PINPOINT_FEATURES_ERROR_ANALYSIS'),
            maxDepth: valueOfNumber('PINPOINT_FEATURES_ERROR_ANALYSIS_MAX_DEPTH'),
        }
        const normalizedEnv = Object.fromEntries(Object.entries(envErrorAnalysis).filter(([, value]) => value !== undefined))

        const globalConfig = this.config ?? {}
        const hasJsonConfig = globalConfig.features?.errorAnalysis !== undefined
        const hasEnvConfig = Object.keys(normalizedEnv).length > 0
        const errorAnalysis = globalConfig.features?.errorAnalysis || {}

        const merged = {
            ...errorAnalysis,
            ...normalizedEnv
        }

        if (!hasJsonConfig && !hasEnvConfig) {
            return new DisableErrorAnalysisConfig()
        }

        if (merged.enabled === false) {
            return new DisableErrorAnalysisConfig()
        }

        const validMaxDepth = isValidMaxDepth(merged.maxDepth) ? merged.maxDepth : 10
        return new ErrorAnalysisConfig({ ...merged, maxDepth: validMaxDepth })
    }
}

function isValidMaxDepth(maxDepth) {
    return typeof maxDepth === 'number' && Number.isFinite(maxDepth) && maxDepth > 0
}

module.exports = {
    ErrorAnalysisConfigBuilder,
    DisableErrorAnalysisConfig
}
