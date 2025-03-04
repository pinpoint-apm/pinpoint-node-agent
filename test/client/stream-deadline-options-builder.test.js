/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const StreamDeadlineOptionsBuilder = require('../../lib/client/stream-deadline-options-builder')

test('stream deadline options from config without exceptions', function (t) {
    agent.bindHttp({ 'stream-deadline-minutes': null })
    let dut = new StreamDeadlineOptionsBuilder(agent.config)
    t.equal(dut.deadlineSeconds, 0, 'If stream deadline seconds JSON is null, Node.js runtime is returned as 0')

    agent.bindHttp({ 'stream-deadline-minutes': undefined })
    dut = new StreamDeadlineOptionsBuilder(agent.config)
    t.equal(dut.deadlineSeconds, 600, 'If stream deadline seconds JSON is undefined, returns default 600 seconds')

    agent.bindHttp({ 'stream-deadline-minutes': { 'client-side': 1 }})
    dut = new StreamDeadlineOptionsBuilder(agent.config)
    t.equal(dut.deadlineSeconds, 60, 'If stream deadline seconds JSON is 1, returns 60 seconds')

    agent.bindHttp()
    dut = new StreamDeadlineOptionsBuilder(agent.config)
    t.equal(dut.deadlineSeconds, 600, 'If stream deadline seconds JSON is not set, returns default 600 seconds')
    t.end()
})