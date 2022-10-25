/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const log = require('../../../lib/utils/logger')
const Logger = require('../../../lib/utils/log/logger2')

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

test('Logger.Builder', (t) => {
    const expectedAdaptor = {}

    let actual = new Logger.DebugBuilder(expectedAdaptor).build()
    t.equal(actual.type.name, 'DEBUG', 'debug name match')
    t.true(actual.adaptor.output === expectedAdaptor, 'adaptor member variable')
    t.true(actual.isDebug(), 'Debug Log check')

    actual = new Logger.InfoBuilder(expectedAdaptor).build()
    t.equal(actual.type.name, 'INFO', 'info name match')
    t.true(actual.adaptor.output === expectedAdaptor, 'adaptor member variable')
    t.true(actual.isInfo(), 'Info log check')

    actual = new Logger.WarnBuilder(expectedAdaptor).build()
    t.equal(actual.type.name, 'WARN', 'warn name match')
    t.true(actual.adaptor.output === expectedAdaptor, 'adaptor member variable')

    actual = new Logger.ErrorBuilder(expectedAdaptor).build()
    t.equal(actual.type.name, 'ERROR', 'error name match')
    t.true(actual.adaptor.output === expectedAdaptor, 'adaptor member variable')

    actual = new Logger.NoneBuilder(expectedAdaptor).build()
    t.equal(actual.type.name, 'NONE', 'none name match')

    t.end()
})

test('Logger by a log level', (t) => {
    let actual = Logger.makeBuilder('debug', {}).build()
    t.equal(actual.type.name, 'DEBUG')

    actual = Logger.makeBuilder('info', {}).build()
    t.equal(actual.type.name, 'INFO')

    actual = Logger.makeBuilder('warn', {}).build()
    t.equal(actual.type.name, 'WARN')

    actual = Logger.makeBuilder('error', {}).build()
    t.equal(actual.type.name, 'ERROR')

    t.end()
})