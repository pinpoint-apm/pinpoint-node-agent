/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class NormalizedSql {
    static nullObject = new NormalizedSql('', '')
    
    constructor(normalizedSql, parseParameter) {
        this.normalizedSql = normalizedSql
        this.parseParameter = parseParameter
    }

    getNormalizedSql() {
        return this.normalizedSql
    }

    getParseParameter() {
        return this.parseParameter
    }
}

module.exports = NormalizedSql