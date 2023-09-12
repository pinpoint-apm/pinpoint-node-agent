/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

class ParsingResult {
    constructor(sqlId, originalSql, normalizedSql) {
        this.sqlId = sqlId
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

    toString() {
        return `ParsingResult{sqlId=${this.sqlId}, sql=${this.getSql()}, output=${this.getOutput()}}`
    }
}
module.exports = ParsingResult