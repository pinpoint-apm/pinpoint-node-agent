/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfBoolean, valueOfNumber } = require('../../config-builder')

class ExceptionStatsConfig {
    constructor(config) {
        Object.assign(this, config)
    }

    isExceptionStatsEnabled() {
        return true
    }

    getMaxDepth() {
        return this.maxDepth ?? 10
    }
}

class DisableExceptionStatsConfig {
    isExceptionStatsEnabled() {
        return false
    }

    getMaxDepth() {
        return 10
    }
}

class ExceptionStatsConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const envExceptionStats = {
            enabled: valueOfBoolean('PINPOINT_FEATURES_EXCEPTION_STATS'),
            maxDepth: valueOfNumber('PINPOINT_FEATURES_EXCEPTION_STATS_MAX_DEPTH'),
        }
        const normalizedEnv = Object.fromEntries(Object.entries(envExceptionStats).filter(([, value]) => value !== undefined))

        const globalConfig = this.config ?? {}
        const hasJsonConfig = globalConfig.features?.exceptionStats !== undefined
        const hasEnvConfig = Object.keys(normalizedEnv).length > 0
        const exceptionStats = globalConfig.features?.exceptionStats || {}

        const merged = {
            ...exceptionStats,
            ...normalizedEnv
        }

        if (!hasJsonConfig && !hasEnvConfig) {
            return new DisableExceptionStatsConfig()
        }

        if (merged.enabled === false) {
            return new DisableExceptionStatsConfig()
        }

        const validMaxDepth = isValidMaxDepth(merged.maxDepth) ? merged.maxDepth : 10
        return new ExceptionStatsConfig({ ...merged, maxDepth: validMaxDepth })
    }
}

function isValidMaxDepth(maxDepth) {
    return typeof maxDepth === 'number' && Number.isFinite(maxDepth) && maxDepth > 0
}

module.exports = {
    ExceptionStatsConfigBuilder,
    DisableExceptionStatsConfig
}
