/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const config = require('../../config')
const IntIdParsingResult = require('./int-id-parsing-result')
const UidParsingResult = require('./uid-parsing-result')

class ParsingResult {
    constructor(originalSql, normalizedSql) {
        const conf = config.getConfig()
        if (conf.hasSqlStats()) {
            this.result = new UidParsingResult(originalSql, normalizedSql)
        } else {
            this.result = new IntIdParsingResult(originalSql, normalizedSql)
        }
    }

    getId() {
        return this.result.getId()
    }

    getSql() {
        return this.result.getSql()
    }

    getOutput() {
        return this.result.getOutput()
    }

    sqlMetaDataValue() {
        return this.result.sqlMetaDataValue()
    }

    newSqlAnnotation(bindString) {
        return this.result.newSqlAnnotation(bindString)
    }

    toString() {
        return `ParsingResult{sqlId=${this.getId()}, sql=${this.getSql()}, output=${this.getOutput()}}`
    }
}
module.exports = ParsingResult