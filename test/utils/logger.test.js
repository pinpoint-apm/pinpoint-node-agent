/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const log = require('../../lib/utils/logger')

test('isDebug', (t) => {
    t.plan(3)
    log.init()
    t.equal(log.isDebug(), false, 'debug null')

    log.init("DEBUG")
    t.equal(log.isDebug(), true, 'debug')
    t.equal(log.isInfo(), false, 'info false')
})

test('isInfo', (t) => {
    log.logger = null

    t.plan(3)
    t.equal(log.isInfo(), false, 'info null')

    log.init("INFO")
    t.equal(log.isInfo(), true, 'info')
    t.equal(log.isDebug(), false, 'debug false')
})