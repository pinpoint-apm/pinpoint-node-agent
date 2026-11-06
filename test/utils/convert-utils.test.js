/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { addressStringOf } = require('../../lib/utils/convert-utils')

test(`addressStringOf`, (t) => {
    t.plan(4)

    let value = addressStringOf(null, null)
    t.true(value == null)

    value = addressStringOf(undefined, undefined)
    t.true(value == null)

    value = addressStringOf("localhost", 8980)
    t.equal(value, "localhost:8980")

    value = addressStringOf("127.0.0.1", 8000)
    t.equal(value, "127.0.0.1:8000")
})
