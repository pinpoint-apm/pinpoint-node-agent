/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const spanMessages = require('../data/v1/Span_pb')

class SqlUidMetaData {
    constructor(parsingResult) {
        this.sqlUid = parsingResult.getId()
        this.sql = parsingResult.getSql()
    }

    valueOfProtocolBuffer() {
        const pSqlMetaData = new spanMessages.PSqlUidMetaData()
        pSqlMetaData.setSqluid(this.sqlUid)
        pSqlMetaData.setSql(this.sql)
        return pSqlMetaData
    }
}

module.exports = SqlUidMetaData