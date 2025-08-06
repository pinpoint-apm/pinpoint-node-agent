/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const levels = require('loglevel').levels

const LogLevel = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5
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
    constructor(name) {
        this.name = name ?? 'default_logger'
        this.level = levels.WARN
        this.appenders = []
    }

    build() {
        const log = new Log(this.name, this.level)
        log.appenders = this.appenders
        return log
    }

    logLevelDebug() {
        this.level = levels.DEBUG
        return this
    }

    logLevelInfo() {
        this.level = levels.INFO
        return this
    }

    logLevelWarn() {
        this.level = levels.WARN
        return this
    }

    logLevelError() {
        this.level = levels.ERROR
        return this
    }

    logLevelSilent() {
        this.level = levels.SILENT
        return this
    }

    addAppender(appender) {
        // appender가 유효한 객체인지 검증
        if (!appender || typeof appender !== 'object') {
            return this
        }

        // appender가 필수 메서드들을 가지고 있는지 검증
        const requiredMethods = ['debug', 'info', 'warn', 'error']
        const missingMethods = requiredMethods.filter(method =>
            typeof appender[method] !== 'function'
        )

        if (missingMethods.length > 0) {
            return this
        }

        if (appender.loggingLevel === undefined) {
            appender.loggingLevel = LogLevel.WARN
        }

        if (appender.loggingLevel < LogLevel.DEBUG || appender.loggingLevel > LogLevel.SILENT) {
            return this
        }

        this.appenders.push(appender)
        return this
    }
}

module.exports = LogBuilder
module.exports.LogLevel = LogLevel