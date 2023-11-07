/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')

const expected = (expected1, exprected2) => {
    if (semver.satisfies(process.versions.node, '<17.0')) {
        return exprected2
    }
    return expected1
}

module.exports = {
    expected
}