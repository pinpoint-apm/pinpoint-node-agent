/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { IntIdParsingResultFactory } = require('../../context/trace/parsing-result-factory')
const UidParsingResult = require('./uid-parsing-result')

class UidParsingResultFactory extends IntIdParsingResultFactory {
    create(originalSql, normalizedSql) {
        return new UidParsingResult(originalSql, normalizedSql)
    }
}

module.exports = { UidParsingResultFactory }
