/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const SimpleCache = require('../../utils/simple-cache')
const SqlParser = require('./sql-parser')
const ParsingResult = require('./parsing-result')

class SqlMetaDataService {
    constructor() {
        this.cache = new SimpleCache(1024)
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
            const parsingResult = new ParsingResult(sql, normalizedSql)
            this.cache.put(normalizedSql.getNormalizedSql(), parsingResult)
            this.send(parsingResult.sqlMetaDataValue())
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