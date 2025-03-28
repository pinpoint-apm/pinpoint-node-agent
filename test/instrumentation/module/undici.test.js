/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')

test('shimming undici', function (t) {
    require('undici')
    const module =  require('../../../lib/instrumentation/module/undici')
    t.true(module.undiciHook.isInstrumented, 'undici be instrumented by require("undici")')
    t.end()
})