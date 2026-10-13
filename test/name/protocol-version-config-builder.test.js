/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { ConfigBuilder } = require('../../lib/config-builder')
const { ProtocolVersionConfigBuilder } = require('../../lib/name/protocol-version-config-builder')

test('collector.protocolVersion from json config', (t) => {
    let actual = new ProtocolVersionConfigBuilder(config({ collector: {} })).build()
    t.equal(actual.getVersion(), 'v4', 'no protocolVersion defaults to v4')
    t.equal(actual.getProtocolVersion(), '400', 'no protocolVersion sends protocol.version 400')

    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'v3' } })).build()
    t.equal(actual.getVersion(), 'v3', 'v3 is v3')
    t.equal(actual.getProtocolVersion(), '100', 'v3 sends protocol.version 100')

    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'V3' } })).build()
    t.equal(actual.getVersion(), 'v3', 'V3 is case-insensitive v3')
    t.equal(actual.getProtocolVersion(), '100', 'V3 sends protocol.version 100')

    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'v4' } })).build()
    t.equal(actual.getVersion(), 'v4', 'v4 is v4')
    t.equal(actual.getProtocolVersion(), '400', 'v4 sends protocol.version 400')

    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'x' } })).build()
    t.equal(actual.getVersion(), 'v4', 'unknown value falls back to v4')
    t.equal(actual.getProtocolVersion(), '400', 'unknown value sends protocol.version 400')

    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: '' } })).build()
    t.equal(actual.getVersion(), 'v4', 'empty value falls back to v4')
    t.equal(actual.getProtocolVersion(), '400', 'empty value sends protocol.version 400')
    t.end()
})

test('PINPOINT_COLLECTOR_PROTOCOL_VERSION overrides json config', (t) => {
    process.env.PINPOINT_COLLECTOR_PROTOCOL_VERSION = 'V3'
    let actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'v4' } })).build()
    t.equal(actual.getVersion(), 'v3', 'env V3 overrides json v4')

    process.env.PINPOINT_COLLECTOR_PROTOCOL_VERSION = 'v4'
    actual = new ProtocolVersionConfigBuilder(config({ collector: { protocolVersion: 'v3' } })).build()
    t.equal(actual.getVersion(), 'v4', 'env v4 overrides json v3')
    delete process.env.PINPOINT_COLLECTOR_PROTOCOL_VERSION
    t.end()
})

function config(json) {
    return new ConfigBuilder({ agentId: 'agentId', applicationName: 'appName' }).setUserDefinedJson(json).build()
}
