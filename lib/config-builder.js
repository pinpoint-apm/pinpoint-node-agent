/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const fs = require('fs')
const path = require('path')

class Config {
    constructor(config) {
        Object.assign(this, config)
        Object.freeze(this)
    }
}

class ConfigBuilder {
    constructor(agentStartupUserDefinedJson = {}) {
        this.agentStartupUserDefinedJson = agentStartupUserDefinedJson
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
            this.defaultJson = require('./pinpoint-config-default')
        }

        if (!this.userDefinedJson) {
            this.userDefinedJson = this.userDefinedJsonFromFile()
        }

        const config = Object.assign({},
            this.defaultJson,
            this.userDefinedJson,
            this.agentStartupUserDefinedJson
        )
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
            console.error('Failed to read or parse pinpoint-config.json:', e)
            return {}
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

class EnvironmentConfig {
    constructor() {
        this.env = {
            agentId: valueOfString('PINPOINT_AGENT_ID'),
            agentName: valueOfString('PINPOINT_AGENT_NAME'),
            applicationName: valueOfString('PINPOINT_APPLICATION_NAME'),
            applicationServiceType: valueOfNumber('PINPOINT_SERVICE_TYPE'),
            collector: new CollectorEnvironmentConfig(),
            sampling: new SamplingEnvironmentConfig(),
            features: {
                container: valueOfBoolean('PINPOINT_CONTAINER'),
                logLevels: new LogLevelsEnvironmentConfig(),
                traceExclusionUrl: new TraceExclusionUrlEnvironmentConfig(),
                sqlStats: valueOfBoolean('PINPOINT_PROFILER_SQL_STAT')
            },
            plugins: new PluginsEnvironmentConfig()
        }
    }
}

class CollectorEnvironmentConfig {
    constructor() {
        this.env = {
            ip: valueOfString('PINPOINT_COLLECTOR_IP'),
            spanPort: valueOfNumber('PINPOINT_COLLECTOR_SPAN_PORT'),
            statPort: valueOfNumber('PINPOINT_COLLECTOR_STAT_PORT'),
            tcpPort: valueOfNumber('PINPOINT_COLLECTOR_TCP_PORT'),
        }
    }
}

class SamplingEnvironmentConfig {
    constructor() {
        const samplingEnable = valueOfBoolean('PINPOINT_SAMPLING')
        if (!samplingEnable) {
            return
        }

        this.env = {
            rate: valueOfNumber('PINPOINT_SAMPLING_RATE')
        }
    }
}

class LogLevelsEnvironmentConfig {
    constructor() {
        this.levels = valueOfLoggerLevels('PINPOINT_LOGGER_LEVELS')
    }
}

class TraceExclusionUrlEnvironmentConfig {
    constructor() {
        this.patterns = valueOfString('PINPOINT_TRACE_EXCLUSION_URL_PATTERNS')
        this.cacheSize = valueOfNumber('PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE')
    }
}

class PluginsEnvironmentConfig {
    constructor() {
        this.httpErrorStatusCodes = valueOfString('PINPOINT_HTTP_STATUS_CODE_ERRORS')
    }
}

module.exports = {
    ConfigBuilder,
    Config
}