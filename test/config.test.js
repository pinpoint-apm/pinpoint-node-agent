/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log } = require('./test-helper')

const config = require('../lib/config')
const path = require('path')

test('Agent ID required field', function (t) {
  t.plan(1)

  config.clear()
  const conf = config.getConfig()

  t.ok(conf.agentId == undefined)
})

test('Should be configured with environment variable', function (t) {
  t.plan(1)

  const agentId = 'id-from-env'
  process.env.PINPOINT_AGENT_ID = agentId
  config.clear()
  const conf = config.getConfig()

  t.equal(agentId, conf.agentId)
})

test('Should be configured with argument', function (t) {
  t.plan(1)

  process.env.PINPOINT_AGENT_ID = 'id-from-env'
  const agentId = 'id-from-argument'
  config.clear()
  const conf = config.getConfig({
    "agent-id": agentId
  }, false)

  t.equal(agentId, conf.agentId)
})

test('Should be read from config file', function (t) {
  t.plan(1)

  const testConfig = require('./pinpoint-config-test')
  const result = config.readConfigJson(testConfig)
  log.debug(result)
  t.ok(result)
})

test('deadline config', (t) => {
  t.plan(1)

  const json = require('../lib/pinpoint-config-default')
  const result = config.readConfigJson(json)
  t.equal(result.streamDeadlineMinutesClientSide, 5)
})

test('main moudle path', (t) => {
  config.clear()
  const conf = config.readRootConfigFile()
  t.deepEqual(conf, {}, 'configuration is null object')
  let actual = config.getMainModulePath(require)
  let actualParsedPath = path.parse(actual)
  t.deepEqual(actualParsedPath.base, 'test', 'main module path')

  actual = config.getMainModulePath({})
  t.true(actual === undefined, 'config.getMainModulePath({}) return value is undefined')

  actual = config.getMainModulePath()
  t.true(actual === undefined, 'config.getMainModulePath() return value is undefined')

  actual = config.getMainModulePath(null)
  t.true(actual === undefined, 'config.getMainModulePath(null) return value is undefined')

  actual = config.getMainModulePath({ main: {} })
  t.true(actual === undefined, 'config.getMainModulePath({ main: {} }) return value is undefined')

  actual = config.getMainModulePath({ main: { filename: '/test' } })
  t.equal(actual, '/', 'config.getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  actual = config.getMainModulePath({ main: { filename: '/test/test1' } })
  t.equal(actual, '/test', 'config.getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  t.end()
})