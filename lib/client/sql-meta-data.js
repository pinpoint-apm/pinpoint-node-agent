/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const spanMessages = require('../data/v1/Span_pb')
class SqlMetaData {
    constructor(parsingResult) {
        this.sqlId = parsingResult.getId()
        this.sql = parsingResult.getSql()
    }

    valueOfProtocolBuffer() {
        const pSqlMetaData = new spanMessages.PSqlMetaData()
        pSqlMetaData.setSqlid(this.sqlId)
        pSqlMetaData.setSql(this.sql)
        return pSqlMetaData
    }
}

module.exports = SqlMetaData