/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const SimpleCache = require('../../utils/simple-cache')
const SqlParser = require('./sql-parser')
const ParsingResult = require('./parsing-result')

class SqlMetadataService {
    constructor() {
        this.cache = new SimpleCache(1024)
    }

    setDataSender(dataSender) {
        this.dataSender = dataSender
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
        this.dataSender?.send?.(sqlMetaData)
    }
}

module.exports = new SqlMetadataService()