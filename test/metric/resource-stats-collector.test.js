/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const v8Compatibility = require('../../lib/metric/v8-compatibility')
const { getNodeVersion } = require('../../lib/metric/v8-compatibility')

test(`detect Node 8, core-js, version`, (t) => {
    const origin = v8Compatibility.getNodeVersion

    v8Compatibility.getNodeVersion = () => {
        return '8.9.3'
    }
    v8Compatibility.initialize()
    t.true(v8Compatibility.disabled, "8.9.3 disable version")

    v8Compatibility.getNodeVersion = () => {
        return '0.3.4'
    }
    v8Compatibility.initialize()
    t.true(v8Compatibility.disabled, "0.3.4 disable version")

    v8Compatibility.getNodeVersion = () => {
        return '9.0.0'
    }
    v8Compatibility.initialize()
    t.true(v8Compatibility.disabled, "0.3.4 disable version")

    v8Compatibility.getNodeVersion = origin
    v8Compatibility.initialize()
    t.equal(v8Compatibility.getNodeVersion(), process.versions.node)
    t.false(v8Compatibility.disabled(), `${process.versions.node} v8 enabled version`)
    t.end()
})