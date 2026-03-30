/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const IntIdParsingResult = require('../../instrumentation/sql/int-id-parsing-result')

class IntIdParsingResultFactory {
    create(originalSql, normalizedSql) {
        return new IntIdParsingResult(originalSql, normalizedSql)
    }
}

module.exports = { IntIdParsingResultFactory }
