/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

const { sqlMetaDataCacheKeyGenerator } = require('../../context/sequence-generators')
const SimpleCache = require('../../utils/simple-cache')
const SqlParser = require('./sql-parser')
const ParsingResult = require('./parsing-result')
const SqlMetaData = require('../../client/sql-meta-data')
const { join } = require('../../client/data-sender-factory')

class SqlMetaDataService {
    constructor() {
        this.cache = new SimpleCache(1024)
        join(this)
    }

    set dataSender(dataSender) {
        this._dataSender = dataSender
    }

    get dataSender() {
        return this._dataSender
    }

    cacheSql(sql) {
        if (!sql) {
            return
        }

        const normalizedSql = SqlParser.normalizedSql(sql)
        const cachedValue = this.cache.get(normalizedSql.getNormalizedSql())
        if (cachedValue === null) {
            const parsingResult = new ParsingResult(sqlMetaDataCacheKeyGenerator.next, sql, normalizedSql)
            this.cache.put(normalizedSql.getNormalizedSql(), parsingResult)
            this.send(new SqlMetaData(parsingResult))
            return parsingResult
        }
        return cachedValue
    }

    send(sqlMetaData) {
        if (this.dataSender && typeof this.dataSender.send === 'function') {
            this.dataSender.send(sqlMetaData)
        }
    }
}

module.exports = new SqlMetaDataService()