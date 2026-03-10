/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfBoolean, valueOfNumber } = require('../../config-builder')

class UriStatsConfig {
    constructor(config) {
        Object.assign(this, config)
    }

    getUriStatsCapacity() {
        return this.capacity ?? 1000
    }

    isUriStatsHttpMethodEnabled() {
        return this.httpMethod === true
    }

    isUriStatsUseUserInput() {
        return this.useUserInput === true
    }

    isUriStatsEnabled() {
        return true
    }
}

class DisableUriStatsConfig {
    getUriStatsCapacity() {
        return 1000
    }

    isUriStatsHttpMethodEnabled() {
        return false
    }

    isUriStatsUseUserInput() {
        return false
    }

    isUriStatsEnabled() {
        return false
    }
}

class UriStatsConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const envUriStats = {
            enabled: valueOfBoolean('PINPOINT_FEATURES_URI_STATS'),
            httpMethod: valueOfBoolean('PINPOINT_FEATURES_URI_STATS_HTTP_METHOD'),
            capacity: valueOfNumber('PINPOINT_FEATURES_URI_STATS_CAPACITY'),
            timeWindow: valueOfNumber('PINPOINT_FEATURES_URI_STATS_TIME_WINDOW'),
            useUserInput: valueOfBoolean('PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT')
        }
        const normalizedEnvUriStats = Object.fromEntries(Object.entries(envUriStats).filter(([, value]) => value !== undefined))

        const globalConfig = this.config ?? {}
        const uriStats = globalConfig.features?.uriStats || {}

        const mergedUriStats = {
            ...uriStats,
            ...normalizedEnvUriStats
        }

        if (Object.values(mergedUriStats).every(v => v === undefined)) {
            return new DisableUriStatsConfig()
        }

        if (mergedUriStats.enabled === false) {
            return new DisableUriStatsConfig()
        }

        const validCapacity = isValidCapacity(mergedUriStats.capacity) ? mergedUriStats.capacity : 1000
        const config = JSON.parse(JSON.stringify(globalConfig))
        return new UriStatsConfig({ ...config, ...mergedUriStats, capacity: validCapacity })
    }
}

function isValidCapacity(capacity) {
    return typeof capacity === 'number' && Number.isFinite(capacity) && capacity > 0
}

module.exports = {
    UriStatsConfigBuilder
}