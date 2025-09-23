/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class LogLevel {
    static get TRACE() {
        return 0
    }

    static get DEBUG() {
        return 1
    }

    static get INFO() {
        return 2
    }

    static get WARN() {
        return 3
    }

    static get ERROR() {
        return 4
    }

    static get SILENT() {
        return 5
    }
}

class Log {
    constructor(name, level) {
        this.name = name
        this.level = level
        this.appenders = []
    }

    getName() {
        return this.name
    }

    getLevel() {
        return this.level
    }

    getAppenders() {
        return this.appenders
    }
}

class LogBuilder {
    static buildGrpcLog() {
        return new LogBuilder('grpcLogger').build()
    }

    static createDefaultLogBuilder() {
        return new LogBuilder('default-logger')
    }

    constructor(name) {
        this.name = name
        this.level = LogLevel.WARN
        this.appenders = []
    }

    build() {
        if (!this.config) {
            const log = new Log(this.name, this.level)
            log.appenders = this.appenders
            return log
        }

        const level = this.valueOfLoggingLevel(this.config.loggerLevels[this.name]) ?? this.level
        const log = new Log(this.name, level)
        log.appenders = this.appenders.map(appender => {
            const specificKey = `${this.name}.${appender.name}`
            const globalKey = `.${appender.name}`

            const specificLevel = this.valueOfLoggingLevel(this.config.loggerLevels[specificKey])
            const globalLevel = this.valueOfLoggingLevel(this.config.loggerLevels[globalKey])

            appender.loggingLevel = specificLevel ?? globalLevel ?? appender.loggingLevel ?? level
            return appender
        })
        return log
    }

    valueOfLoggingLevel(stringLogLevel) {
        if (typeof stringLogLevel !== 'string') {
            return null
        }

        return LogLevel[stringLogLevel.toUpperCase()]
    }

    logLevelDebug() {
        this.level = LogLevel.DEBUG
        return this
    }

    logLevelInfo() {
        this.level = LogLevel.INFO
        return this
    }

    logLevelWarn() {
        this.level = LogLevel.WARN
        return this
    }

    logLevelError() {
        this.level = LogLevel.ERROR
        return this
    }

    logLevelSilent() {
        this.level = LogLevel.SILENT
        return this
    }

    addAppender(appender) {
        if (!appender) {
            return this
        }

        const requiredMethods = ['debug', 'info', 'warn', 'error']
        const missingMethods = requiredMethods.filter(method =>
            typeof appender[method] !== 'function'
        )

        if (missingMethods.length > 0) {
            return this
        }

        if (!appender.name || typeof appender.name !== 'string') {
            return this
        }

        const newAppender = { ...appender } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
        Object.setPrototypeOf(newAppender, Object.getPrototypeOf(appender))
        this.appenders.push(newAppender)
        return this
    }

    setConfig(config) {
        if (!config?.loggerLevels) {
            return this
        }

        this.config = config
        return this
    }
}

module.exports = {
    LogBuilder,
    LogLevel,
    Log
}