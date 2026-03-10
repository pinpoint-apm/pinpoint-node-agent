/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../../lib/config-builder')
const { UriStatsConfigBuilder } = require('../../lib/metric/uri/uri-stats-config-builder')

function clearUriStatsEnv() {
  delete process.env.PINPOINT_FEATURES_URI_STATS
  delete process.env.PINPOINT_FEATURES_URI_STATS_HTTP_METHOD
  delete process.env.PINPOINT_FEATURES_URI_STATS_CAPACITY
  delete process.env.PINPOINT_FEATURES_URI_STATS_TIME_WINDOW
  delete process.env.PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT
}

test('uri config is preserved', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  const defaultJson = Object.assign({}, require('../../lib/pinpoint-config-default.json'), {
    agentId: 'agent-from-test',
    applicationName: 'app-from-test',
    features: Object.assign({}, require('../../lib/pinpoint-config-default.json').features, {
      uriStats: {
        httpMethod: true,
        capacity: 500
      }
    })
  })

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().setDefaultJson(defaultJson).build()).build()
  t.equal(conf.getUriStatsCapacity(), 500, 'uriStats capacity should be preserved')
  t.equal(conf.isUriStatsHttpMethodEnabled(), true, 'uriStats httpMethod flag should be preserved')
  t.false(conf.isUriStatsUseUserInput(), 'uriStats useUserInput should be false')
  t.true(conf.isUriStatsEnabled(), 'uriStats should be enabled when httpMethod is set')

  clearUriStatsEnv()
})

test('uriStats follows default config when URI environment variables are not set', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), true, 'uriStats should follow default config when URI env vars are not set')
  t.false(conf.isUriStatsHttpMethodEnabled(), 'uriStats httpMethod should be disabled when not configured')
  t.true(conf.isUriStatsUseUserInput(), 'uriStats useUserInput should follow default config')
  t.equal(conf.getUriStatsCapacity(), 1000, 'getUriStatsCapacity should follow default config')

  clearUriStatsEnv()
})

test('uriStats preserves httpMethod only when capacity not set', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS_HTTP_METHOD = 'true'

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), true, 'isUriStatsEnabled should be true when httpMethod is set')
  t.true(conf.isUriStatsHttpMethodEnabled(), 'uriStats httpMethod should respect env value')
  t.true(conf.isUriStatsUseUserInput(), 'useUserInput should follow default config when not set in env')
  t.equal(conf.getUriStatsCapacity(), 1000, 'uriStats capacity defaults to 1000 when uriStats is configured')

  clearUriStatsEnv()
})

test('uriStats preserves capacity only when httpMethod not set', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS_CAPACITY = '321'

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), true, 'isUriStatsEnabled should be true when capacity is set')
  t.false(conf.isUriStatsHttpMethodEnabled(), 'uriStats httpMethod should be disabled when not set')
  t.true(conf.isUriStatsUseUserInput(), 'useUserInput should follow default config when not set in env')
  t.equal(conf.getUriStatsCapacity(), 321, 'uriStats capacity should respect env value')

  clearUriStatsEnv()
})

test('uriStats capacity defaults to 1000 when env capacity is invalid', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS_HTTP_METHOD = 'true'
  process.env.PINPOINT_FEATURES_URI_STATS_CAPACITY = 'abc'

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), true, 'uriStats stays enabled when httpMethod is set')
  t.true(conf.isUriStatsHttpMethodEnabled(), 'httpMethod flag should be preserved when capacity is sanitized')
  t.true(conf.isUriStatsUseUserInput(), 'useUserInput should follow default config when not set in env')
  t.equal(conf.getUriStatsCapacity(), 1000, 'getUriStatsCapacity returns 1000 when capacity is invalid')

  clearUriStatsEnv()
})

test('uriStats useUserInput configuration', (t) => {
  t.plan(8)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS_USE_USER_INPUT = 'true'
  const conf = new UriStatsConfigBuilder().build()
  t.equal(conf.isUriStatsEnabled(), true, 'uriStats should be enabled when useUserInput is set')
  t.false(conf.isUriStatsHttpMethodEnabled(), 'httpMethod should be false when not set')
  t.equal(conf.isUriStatsUseUserInput(), true, 'useUserInput should be true when set via env')
  t.equal(conf.getUriStatsCapacity(), 1000, 'uriStats capacity should default to 1000 when useUserInput is set')

  clearUriStatsEnv()
  const confDefault = new UriStatsConfigBuilder().build()
  t.equal(confDefault.isUriStatsEnabled(), false, 'uriStats should be disabled by default')
  t.false(confDefault.isUriStatsHttpMethodEnabled(), 'httpMethod should be false by default')
  t.equal(confDefault.isUriStatsUseUserInput(), false, 'useUserInput should be false by default')
  t.equal(confDefault.getUriStatsCapacity(), 1000, 'uriStats capacity should default to 1000 by default')

  clearUriStatsEnv()
})

test('uriStats can be explicitly enabled by PINPOINT_FEATURES_URI_STATS', (t) => {
  t.plan(4)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS = 'true'

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), true, 'uriStats should be enabled when PINPOINT_FEATURES_URI_STATS is true')
  t.false(conf.isUriStatsHttpMethodEnabled(), 'httpMethod should be false when not set')
  t.equal(conf.isUriStatsUseUserInput(), true, 'useUserInput should follow default config when not set in env')
  t.equal(conf.getUriStatsCapacity(), 1000, 'default capacity should be used when explicitly enabled')

  clearUriStatsEnv()
})

test('uriStats can be explicitly disabled by PINPOINT_FEATURES_URI_STATS', (t) => {
  t.plan(3)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS = 'false'
  process.env.PINPOINT_FEATURES_URI_STATS_HTTP_METHOD = 'true'
  process.env.PINPOINT_FEATURES_URI_STATS_CAPACITY = '321'

  const conf = new UriStatsConfigBuilder(new ConfigBuilder().build()).build()
  t.equal(conf.isUriStatsEnabled(), false, 'uriStats should be disabled when PINPOINT_FEATURES_URI_STATS is false')
  t.false(conf.isUriStatsHttpMethodEnabled(), 'httpMethod should not be applied when explicitly disabled')
  t.equal(conf.getUriStatsCapacity(), 1000, 'capacity should fall back to default when explicitly disabled')

  clearUriStatsEnv()
})

test('PINPOINT_FEATURES_URI_STATS=false overrides config uriStats options', (t) => {
  t.plan(1)
  clearUriStatsEnv()

  process.env.PINPOINT_FEATURES_URI_STATS = 'false'

  const conf = new UriStatsConfigBuilder({
    features: {
      uriStats: {
        httpMethod: true,
        capacity: 500,
        useUserInput: true
      }
    }
  }).build()

  t.equal(conf.isUriStatsEnabled(), false, 'explicit false env should override config uriStats options')

  clearUriStatsEnv()
})