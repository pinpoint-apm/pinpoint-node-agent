/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')
const { randomBytes } = require('node:crypto')
const { levels } = require('loglevel')
const { HttpStatusCodeErrorsBuilder } = require('./instrumentation/http/http-status-code-errors-builder')
const { features } = require('node:process')

class Config {
    constructor(config) {
        Object.assign(this, config)
        Object.defineProperty(this, 'httpStatusCodeErrors', {
            value: new HttpStatusCodeErrorsBuilder(this.plugins.http.errorStatusCodes).build(),
            enumerable: false,
            writable: false,
        })
        Object.freeze(this)
    }

    getHttpStatusCodeErrors() {
        return this.httpStatusCodeErrors
    }

    getSamplingRate() {
        return this.sampling?.rate ?? 10
    }

    getExclusionUrl() {
        const patterns = Array.isArray(this.features?.traceExclusionUrl?.patterns)
            ? this.features.traceExclusionUrl.patterns
            : []

        const rawCacheSize = this.features?.traceExclusionUrl?.cacheSize
        const hasPatterns = patterns.length > 0
        const cacheSize = typeof rawCacheSize === 'number' && Number.isFinite(rawCacheSize)
            ? rawCacheSize
            : hasPatterns ? 100: undefined
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
}

class ConfigBuilder {
    constructor(agentStartupUserDefinedJson = {}) {
        this.agentStartupUserDefinedJson = agentStartupUserDefinedJson
        this.handlers = [
            new AgentIdGenerator(),
            new AgentIdAndApplicationNameAndAgentNameValidator(),
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

    addHandler(handler) {
        this.handlers.push(handler)
        return this
    }

    build() {
        if (!this.defaultJson) {
            this.defaultJson = require('./pinpoint-config-default2.json')
        }

        if (!this.userDefinedJson) {
            this.userDefinedJson = this.userDefinedJsonFromFile()
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

    userDefinedJsonFromFile() {
        const path = [
            this.pathForRequireFunction(),
            this.pathForUserDefinedJson()
        ].filter(String)

        const configFilePath = path.find(path => fs.existsSync(path))
        if (!configFilePath) {
            return {}
        }

        try {
            const fileContent = fs.readFileSync(configFilePath, 'utf8')
            return JSON.parse(fileContent)
        } catch (e) {
            return new MessagesBuilder()
                .addWarns(`Failed to read or parse pinpoint-config.json at ${configFilePath}: ${e.message}`)
                .build()
        }
    }

    pathForUserDefinedJson() {
        return path.resolve(process.cwd(), 'pinpoint-config.json')
    }

    pathForRequireFunction() {
        if (!require.main || !require.main.filename) {
            return
        }
        return path.join(path.dirname(require.main.filename), 'pinpoint-config.json')
    }
}

function applyConfigChanges(target, changes) {
    if (!changes || typeof changes !== 'object') {
        return
    }

    for (const [key, value] of Object.entries(changes)) {
        if (value === undefined) {
            continue
        }

        if (value.shouldPrune?.()) {
            delete target[key]
            continue
        }

        if (isPlainObject(value) && isPlainObject(target[key])) {
            applyConfigChanges(target[key], value)
        } else {
            target[key] = value
        }
    }
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

class AgentIdGenerator {
    handle(config) {
        if (config.agentId?.length > 0) {
            return {}
        }

        return { agentId: randomBytes(8).toString('hex') }
    }
}

class MessagesBuilder {
    constructor() {
        this.errors = []
        this.warns = []
    }

    addError(error) {
        this.errors.push(error)
        return this
    }

    addWarn(warn) {
        this.warns.push(warn)
        return this
    }

    build() {
        return { messages: { errors: this.errors, warns: this.warns } }
    }
}

class AgentIdAndApplicationNameAndAgentNameValidator {
    handle(config) {
        const fields = [
            { label: 'Agent ID', value: config.agentId, maxLength: 24, required: true },
            { label: 'Application Name', value: config.applicationName, maxLength: 24, required: true },
            { label: 'Agent Name', value: config.agentName, maxLength: 255, required: false }
        ]

        const messages = new MessagesBuilder()

        for (const field of fields) {
            const errors = validateIdField(field)
            for (const err of errors) {
                messages.addError(err)
            }
        }

        if (messages.errors.length > 0) {
            return mergeConfig({ enable: false }, messages.build())
        }

        if (typeof config.agentName === 'string' && config.agentName.trim().length === 0) {
            config.agentName = undefined
        }

        return {}
    }
}

function validateIdField({ label, value, maxLength, required }) {
    const link = 'https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables'

    if (!value || value.trim().length === 0) {
        return required ? [`${label} is required. See ${link}`] : []
    }

    const errors = []

    if (value.length > maxLength) {
        errors.push(`${label} is too long (max ${maxLength} characters). See ${link}`)
    }

    if (!/^[a-zA-Z0-9\._\-]+$/.test(value)) {
        errors.push(`${label} has invalid characters; allowed [a-zA-Z0-9._-]. Value: ${value}. See ${link}`)
    }

    return errors
}

class TraceExclusionUrlCacheSizeValidator {
    handle(config) {
        const patterns = config.features?.traceExclusionUrl?.patterns
        const cacheSize = config.features?.traceExclusionUrl?.cacheSize
        if (!Array.isArray(patterns)) {
            if (cacheSize !== undefined) {
                return mergeConfig(
                    {
                        features: {
                            traceExclusionUrl: {
                                patterns: new PruneKeyValue(),
                                cacheSize: new PruneKeyValue()
                            }
                        }
                    },
                    new MessagesBuilder()
                    .addWarn(`You have to set the PINPOINT_TRACE_EXCLUSION_URL_PATTERNS, PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE or trace-exclusion-url{ pattern: 'pattern', 'cache-size': 100} for using excludsion url cache.`)
                    .build())
            }
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

class PruneKeyValue {
    shouldPrune() {
        return true
    }
}

function makeEnvironmentConfig() {
    const envConfig = {
        agentId: valueOfString('PINPOINT_AGENT_ID'),
        agentName: valueOfString('PINPOINT_AGENT_NAME'),
        applicationName: valueOfString('PINPOINT_APPLICATION_NAME'),
        applicationServiceType: valueOfNumber('PINPOINT_SERVICE_TYPE'),
        collector: {
            ip: valueOfString('PINPOINT_COLLECTOR_IP'),
            spanPort: valueOfNumber('PINPOINT_COLLECTOR_SPAN_PORT'),
            statPort: valueOfNumber('PINPOINT_COLLECTOR_STAT_PORT'),
            tcpPort: valueOfNumber('PINPOINT_COLLECTOR_TCP_PORT'),
        },
        sampling: {
            "enable": valueOfBoolean('PINPOINT_SAMPLING'),
            rate: valueOfNumber('PINPOINT_SAMPLING_RATE')
        },
        features: {
            container: valueOfBoolean('PINPOINT_CONTAINER'),
            logLevels: makeLogLevelsEnvironmentConfig(),
            traceExclusionUrl: {
                patterns: arrayOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERNS') ?? arrayOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERN'),
                cacheSize: valueOfNumber('PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE')
            },
            sqlStats: valueOfBoolean('PINPOINT_PROFILER_SQL_STAT')
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

function valueOfString(envName) {
    const value = process.env[envName]
    return value !== undefined ? value : undefined
}

function valueOfNumber(envName) {
    const value = process.env[envName]
    return value !== undefined ? Number(value) : undefined
}

function valueOfBoolean(envName) {
    const value = process.env[envName]
    return typeof value === 'string' ? value.toLowerCase() === 'true' : undefined
}

function arrayOfString(envName) {
    const value = process.env[envName]
    if (typeof value !== 'string' || value.trim().length === 0) {
        return undefined
    }
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0)
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
            continue
        }

        if (value.shouldPrune?.()) {
            target[key] = value
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
    Config
}