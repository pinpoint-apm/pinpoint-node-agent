/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SqlMetaData = require('../../client/sql-meta-data')
const { sqlMetaDataCacheKeyGenerator } = require('../../context/sequence-generators')
const IntStringStringValue = require('../context/annotation/int-string-string-value')
const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../context/annotation/annotations')

class IntIdParsingResult {
    constructor(originalSql, normalizedSql) {
        this.sqlId = sqlMetaDataCacheKeyGenerator.next
        this.originalSql = originalSql
        this.sql = normalizedSql
    }

    getId() {
        return this.sqlId
    }

    getSql() {
        return this.sql.getNormalizedSql()
    }

    getOutput() {
        return this.sql.getParseParameter()
    }

    sqlMetaDataValue() {
        return new SqlMetaData(this)
    }

    newSqlAnnotation(bindString) {
        return Annotations.of(annotationKey.SQL_ID.getCode(), new IntStringStringValue(this.getId(), this.getOutput(), bindString))
    }

    toString() {
        return `IntIdParsingResult{sqlId=${this.getId()}, sql=${this.getSql()}, output=${this.getOutput()}}`
    }
}

module.exports = IntIdParsingResult