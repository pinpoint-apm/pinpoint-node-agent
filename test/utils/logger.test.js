'use strict'

const test = require('tape')
const log = require('../../lib/utils/logger')

test('isDebug', (t) => {
    t.plan(2)
    t.equal(log.isDebug(), false, 'debug null')

    log.init("DEBUG")
    t.equal(log.isDebug(), true, 'debug')
})

test('isInfo', (t) => {
    log.logger = null

    t.plan(1)
    t.equal(log.isInfo(), false, 'info null')
})