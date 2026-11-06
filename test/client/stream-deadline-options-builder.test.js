/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { ConfigBuilder } = require('../../lib/config-builder')
const StreamDeadlineOptionsBuilder = require('../../lib/client/stream-deadline-options-builder')

test('stream deadline options from config without exceptions', function (t) {
    let dut = new StreamDeadlineOptionsBuilder(new ConfigBuilder({ 'collector': null }).build())
    t.equal(dut.deadlineSeconds, 600, 'If stream deadline seconds JSON is null, Node.js runtime is returned as 0')

    dut = new StreamDeadlineOptionsBuilder(new ConfigBuilder({ 'collector': undefined }).build())
    t.equal(dut.deadlineSeconds, 600, 'If stream deadline seconds JSON is undefined, returns default 600 seconds')

    dut = new StreamDeadlineOptionsBuilder(new ConfigBuilder({ 'collector': { 'deadlineMinutes': 1 }}).build())
    t.equal(dut.deadlineSeconds, 60, 'If stream deadline seconds JSON is 1, returns 60 seconds')

    dut = new StreamDeadlineOptionsBuilder(new ConfigBuilder({}).build())
    t.equal(dut.deadlineSeconds, 600, 'If stream deadline seconds JSON is not set, returns default 600 seconds')
    t.end()
})