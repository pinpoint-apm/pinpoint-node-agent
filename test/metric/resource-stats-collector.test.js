/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const v8Compatibility = require('../../lib/metric/v8-compatibility')

test(`detect Node 8, core-js, version`, (t) => {
    t.equal(v8Compatibility.version, process.version, "current node version")
    t.end()
})