/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SqlUidMetaData = require('../../client/sql-uid-meta-data')
const murmur128 = require('../../support/murmur3/murmur3-128')
const BytesStringStringValue = require('../context/annotation/bytes-string-string-value')
const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../context/annotation/annotations')

class UidParsingResult {
    constructor(originalSql, normalizedSql) {
        this.sqlId = murmur128(normalizedSql.normalizedSql)
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

    newSqlAnnotation(bindString) {
        return Annotations.of(annotationKey.SQL_UID.getCode(), new BytesStringStringValue(this.getId(), this.getOutput(), bindString))
    }

    sqlMetaDataValue() {
        return new SqlUidMetaData(this)
    }
}

module.exports = UidParsingResult