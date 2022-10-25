/**
 * Pinpoint Node.js Agent
 * Copyright 2022-present NAVER Corp.
 * Apache License v2.0
 */
const test = require('tape')
const Adaptors = require('../lib/adaptors')
const assert = require('node:assert/strict')

test('initialize', function(t) {
    const logger = Adaptors.makeLogger()
    assert.deepStrictEqual(logger, {})
    t.end()
})