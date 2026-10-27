/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { levels } = require('loglevel')
const { HttpStatusCodeErrorsBuilder } = require('./instrumentation/http/http-status-code-errors-builder')
const ServiceConfigBuilder = require('./client/retry/service-config-builder')
const { valueOfString, valueOfNumber, valueOfBoolean, arrayOfString } = require('./support/env-utils')
const { readUserDefinedJson } = require('./support/user-defined-json')
const { NamesAndIdsConfigHandler } = require('./name/names-and-ids-config-handler')
const defaultJSONConfig = require('./pinpoint-config-default.json')

class Config {
    constructor(config) {
        Object.assign(this, config)
        Object.defineProperty(this, 'httpStatusCodeErrors', {
            value: new HttpStatusCodeErrorsBuilder(this.plugins.http.errorStatusCodes).build(),
            enumerable: false,
            writable: false,
        })
        Object.defineProperty(this, 'grpcServiceConfig', {
            value: this.collector?.grpcServiceConfig
                        ? new ServiceConfigBuilder().setJSON(this.collector.grpcServiceConfig).build()
                        : ServiceConfigBuilder.nullObject.build(),
            enumerable: false,
            writable: false,
        })
        Object.freeze(this)
    }

    getHttpStatusCodeErrors() {
        return this.httpStatusCodeErrors
    }

    getGrpcServiceConfig() {
        return this.grpcServiceConfig
    }

    getSamplingRate() {
        return this.sampling?.rate ?? defaultJSONConfig.sampling.rate
    }

    getExclusionUrl() {
        const patterns = Array.isArray(this.features?.traceExclusionUrl?.patterns)
            ? this.features.traceExclusionUrl.patterns
            : []

        const rawCacheSize = this.features?.traceExclusionUrl?.cacheSize
        const hasPatterns = patterns.length > 0
        const cacheSize = typeof rawCacheSize === 'number' && Number.isFinite(rawCacheSize)
            ? rawCacheSize
            : hasPatterns ? 100 : undefined
        return { patterns, cacheSize }
    }

    getCollector() {
        return {
            ip: this.collector.ip,
            spanPort: this.collector.spanPort,
            statPort: this.collector.statPort,
            tcpPort: this.collector.tcpPort
        }
    }

    getSpanBatch() {
        const spanBatch = this.collector.spanBatch ?? {}
        const defaultSpanBatch = defaultJSONConfig.collector.spanBatch
        return {
            size: positiveIntegerOrDefault(spanBatch.size, defaultSpanBatch.size),
            deadlineMillis: positiveNumberOrDefault(spanBatch.deadlineMillis, defaultSpanBatch.deadlineMillis),
            maxRequests: positiveIntegerOrDefault(spanBatch.maxRequests, defaultSpanBatch.maxRequests)
        }
    }

    getDeadlineSeconds() {
        return positiveNumberOrDefault(this.collector.deadlineMinutes, defaultJSONConfig.collector.deadlineMinutes) * 60
    }

    isSamplingEnabled() {
        return this.sampling?.enable === true
    }

    getLogLevels() {
        return this.features?.logLevels ?? defaultJSONConfig.features.logLevels
    }

    isDataSendingEnabled() {
        return this.features?.dataSending === true
    }

    isStatsMonitoringEnabled() {
        return this.features?.statsMonitoring === true
    }

    isGcStatsEnabled() {
        return this.features?.gcStats === true
    }

    isFileDescriptorStatsEnabled() {
        return this.features?.fileDescriptorStats === true
    }

    isContainerEnvironment() {
        return this.features?.container === true
    }

    getAgentId() {
        return this.agentId
    }

    getAgentName() {
        return this.agentName
    }

    getApplicationName() {
        return this.applicationName
    }

    getServiceName() {
        return this.serviceName
    }

    getProtocolVersion() {
        return this.collector?.protocolVersion
    }
}

class ConfigBuilder {
    constructor(agentStartupUserDefinedJson = {}) {
        this.agentStartupUserDefinedJson = agentStartupUserDefinedJson
        this.handlers = [
            new NamesAndIdsConfigHandler(),
            new TraceExclusionUrlCacheSizeValidator()
        ]
    }

    setDefaultJson(json) {
        this.defaultJson = json
        return this
    }

    setUserDefinedJson(json) {
        this.userDefinedJson = json
        return this
    }

    build() {
        if (!this.defaultJson) {
            this.defaultJson = defaultJSONConfig
        }

        if (!this.userDefinedJson) {
            this.userDefinedJson = readUserDefinedJson()
        }

        const config = mergeConfig(
            this.defaultJson,
            this.userDefinedJson,
            makeEnvironmentConfig(),
            this.agentStartupUserDefinedJson
        )
        for (const handler of this.handlers) {
            const changes = handler.handle(config)
            applyConfigChanges(config, changes)
        }
        return new Config(config)
    }
}

function applyConfigChanges(target, changes) {
    if (!changes || typeof changes !== 'object') {
        return
    }

    for (const [key, value] of Object.entries(changes)) {
        if (value === undefined) {
            delete target[key]
            continue
        }

        if (isPlainObject(value) && isPlainObject(target[key])) {
            applyConfigChanges(target[key], value)
        } else if (Array.isArray(value) && Array.isArray(target[key])) {
            target[key] = [...target[key], ...value]
        } else {
            target[key] = value
        }
    }
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

class TraceExclusionUrlCacheSizeValidator {
    handle(config) {
        const patterns = config.features?.traceExclusionUrl?.patterns
        const cacheSize = config.features?.traceExclusionUrl?.cacheSize
        if (!Array.isArray(patterns)) {
            if (cacheSize !== undefined) {
                return {
                    features: {
                        traceExclusionUrl: {
                            patterns: undefined,
                            cacheSize: undefined
                        }
                    },
                    messages: {
                        warns: [`You have to set the PINPOINT_TRACE_EXCLUSION_URL_PATTERNS, PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE or trace-exclusion-url{ pattern: 'pattern', 'cache-size': 100} for using exclusion url cache.`]
                    }
                }
            }
            return {}
        }

        return {
            features: {
                traceExclusionUrl: {
                    cacheSize: typeof cacheSize === 'number' && cacheSize >= 100 ? cacheSize : 100
                }
            }
        }
    }
}

function makeEnvironmentConfig() {
    const envConfig = {
        collector: {
            ip: valueOfString('PINPOINT_COLLECTOR_IP'),
            spanPort: valueOfNumber('PINPOINT_COLLECTOR_SPAN_PORT'),
            statPort: valueOfNumber('PINPOINT_COLLECTOR_STAT_PORT'),
            tcpPort: valueOfNumber('PINPOINT_COLLECTOR_TCP_PORT'),
            spanBatch: {
                size: valueOfNumber('PINPOINT_SPAN_BATCH_SIZE'),
                deadlineMillis: valueOfNumber('PINPOINT_SPAN_BATCH_DEADLINE_MILLIS'),
                maxRequests: valueOfNumber('PINPOINT_SPAN_BATCH_MAX_REQUESTS'),
            },
        },
        sampling: {
            "enable": valueOfBoolean('PINPOINT_SAMPLING'),
            rate: valueOfNumber('PINPOINT_SAMPLING_RATE')
        },
        features: {
            logLevels: makeLogLevelsEnvironmentConfig(),
            traceExclusionUrl: {
                patterns: arrayOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERNS') ?? arrayOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERN'),
                cacheSize: valueOfNumber('PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE')
            },
            sqlStats: valueOfBoolean('PINPOINT_PROFILER_SQL_STAT'),
            gcStats: valueOfBoolean('PINPOINT_FEATURES_GC_STATS'),
            fileDescriptorStats: valueOfBoolean('PINPOINT_FEATURES_FILE_DESCRIPTOR_STATS')
        },
        plugins: {
            http: {
                errorStatusCodes: valueOfString('PINPOINT_HTTP_STATUS_CODE_ERRORS')
            }
        },
        enable: valueOfBoolean('PINPOINT_ENABLE')
    }

    return pruneUndefined(envConfig)
}

function makeLogLevelsEnvironmentConfig() {
    const value = process.env['PINPOINT_LOGGER_LEVELS']
    if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined
    }

    const loggerLevels = {}
    const pairs = value.split(',')

    const validLevels = Object.keys(levels).map(level => level.toUpperCase())
    for (const pair of pairs) {
        const trimmedPair = pair.trim()
        if (trimmedPair.length === 0) continue

        const equalIndex = trimmedPair.indexOf('=')
        if (equalIndex === -1) continue

        const loggerName = trimmedPair.substring(0, equalIndex).trim()
        const logLevel = trimmedPair.substring(equalIndex + 1).trim().toUpperCase()

        if (loggerName.length === 0 || logLevel.length === 0) continue

        if (validLevels.includes(logLevel)) {
            loggerLevels[loggerName] = logLevel
        }
    }

    return Object.keys(loggerLevels).length > 0 ? loggerLevels : undefined
}


function mergeConfig(...sources) {
    const result = {}
    for (const source of sources) {
        mergeObject(result, source)
    }
    return result
}

function mergeObject(target, source) {
    if (!isPlainObject(source)) {
        return target
    }

    for (const [key, value] of Object.entries(source)) {
        if (value === undefined || value === null) {
            delete target[key]
            continue
        }

        if (isPlainObject(value)) {
            if (!isPlainObject(target[key])) {
                target[key] = {}
            }
            mergeObject(target[key], value)
        } else {
            target[key] = value
        }
    }
    return target
}

function positiveNumberOrDefault(value, defaultValue) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        return defaultValue
    }
    return value
}

function positiveIntegerOrDefault(value, defaultValue) {
    if (!Number.isInteger(value) || value <= 0) {
        return defaultValue
    }
    return value
}

function pruneUndefined(value) {
    if (Array.isArray(value)) {
        return value
    }

    if (!isPlainObject(value)) {
        return value
    }

    const pruned = {}
    for (const [key, val] of Object.entries(value)) {
        if (val === undefined) {
            continue
        }

        const normalizedVal = pruneUndefined(val)
        if (isPlainObject(normalizedVal) && Object.keys(normalizedVal).length === 0) {
            continue
        }

        pruned[key] = normalizedVal
    }
    return pruned
}

module.exports = {
    ConfigBuilder,
    Config,
}