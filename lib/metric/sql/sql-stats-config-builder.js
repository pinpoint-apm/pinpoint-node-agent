/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfBoolean } = require('../../config-builder')

class SqlStatsConfig {
    isSqlStatsEnabled() {
        return true
    }
}

class DisableSqlStatsConfig {
    isSqlStatsEnabled() {
        return false
    }
}

class SqlStatsConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const envSqlStats = valueOfBoolean('PINPOINT_PROFILER_SQL_STAT')
        const configSqlStats = this.config?.features?.sqlStats

        if (envSqlStats === true || configSqlStats === true) {
            return new SqlStatsConfig()
        }

        return new DisableSqlStatsConfig()
    }
}

module.exports = { SqlStatsConfigBuilder }
