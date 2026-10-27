/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../lib/config-builder')
const path = require('path')
const { isContainerEnvironment } = require('../lib/support/container-environment')

test('Should be read from config file', function (t) {
  t.plan(2)

  delete process.env.PINPOINT_COLLECTOR_IP
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERNS
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  const testJson = require('./pinpoint-config-test.json')
  const json = Object.assign({}, testJson, { sampling: { rate: 10 }, collector: { ...testJson.collector, protocolVersion: 'v3' } })
  const actual = new ConfigBuilder().setDefaultJson(json).build()
  const { serviceName, ...v3Json } = json
  t.equal(serviceName, 'test.service.name', 'the config file has serviceName')
  t.deepEqual(actual, {
    ...v3Json,
    agentName: json.agentId,
    features: { ...json.features, container: isContainerEnvironment() },
  }, 'the config file json with the final names and ids')
})

test('deadline config', (t) => {
  t.plan(1)

  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()
  t.equal(conf.collector.deadlineMinutes, 10)
})

test('GC stats are disabled by default', (t) => {
  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()

  t.equal(conf.isGcStatsEnabled(), false, 'features.gcStats defaults to false')
  t.end()
})

test('PINPOINT_FEATURES_GC_STATS=true enables GC stats', (t) => {
  process.env['PINPOINT_FEATURES_GC_STATS'] = 'true'
  t.teardown(() => delete process.env.PINPOINT_FEATURES_GC_STATS)

  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()

  t.equal(conf.isGcStatsEnabled(), true, 'features.gcStats is true')
  t.end()
})

test('file descriptor stats are disabled by default', (t) => {
  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()

  t.equal(conf.isFileDescriptorStatsEnabled(), false, 'features.fileDescriptorStats defaults to false')
  t.end()
})

test('PINPOINT_FEATURES_FILE_DESCRIPTOR_STATS=true enables file descriptor stats', (t) => {
  process.env['PINPOINT_FEATURES_FILE_DESCRIPTOR_STATS'] = 'true'
  t.teardown(() => delete process.env.PINPOINT_FEATURES_FILE_DESCRIPTOR_STATS)

  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()

  t.equal(conf.isFileDescriptorStatsEnabled(), true, 'features.fileDescriptorStats is true')
  t.end()
})

test('span batch config defaults to size 20, deadlineMillis 500 and maxRequests 10', (t) => {
  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()

  t.deepEqual(conf.getSpanBatch(), { size: 20, deadlineMillis: 500, maxRequests: 10 })
  t.end()
})

test('span batch config uses the default for a non-positive or non-number value', (t) => {
  const conf = new ConfigBuilder({ collector: { spanBatch: { size: 0, deadlineMillis: -1, maxRequests: 'ten' } } }).build()

  t.deepEqual(conf.getSpanBatch(), { size: 20, deadlineMillis: 500, maxRequests: 10 })
  t.end()
})

test('span batch config uses the default for a non-integer size or maxRequests', (t) => {
  const conf = new ConfigBuilder({ collector: { spanBatch: { size: 0.5, deadlineMillis: 250.5, maxRequests: 1.5 } } }).build()

  t.deepEqual(conf.getSpanBatch(), { size: 20, deadlineMillis: 250.5, maxRequests: 10 })
  t.end()
})

test('ConfigBuilder pathForRequireFunction Learning Test', (t) => {
  let actual = {}.main
  t.true(actual === undefined, '{}.main return value is undefined')

  actual = { main: {} }.main.filename
  t.true(actual === undefined, 'getMainModulePath({ main: {} }) return value is undefined')

  actual = path.dirname({ main: { filename: '/test' } }.main.filename)
  t.equal(actual, '/', 'getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  actual = path.dirname({ main: { filename: '/test/test1' } }.main.filename)
  t.equal(actual, '/test', 'getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  t.end()
})

test('sampling Rate', (t) => {
  let conf = new ConfigBuilder().build()
  t.equal(conf.sampling.rate, 10, 'default sampling rate is 10')

  conf = new ConfigBuilder({ 'sampling': { 'rate': 20} }).build()
  t.equal(conf.sampling.rate, 20, 'sampling rate is 20')

  t.end()
})

test('HTTP Status Code Errors with config changes', (t) => {
  const defaultConf = new ConfigBuilder().build()
  t.equal(defaultConf.plugins.http.errorStatusCodes, '5xx,401,403', 'default: httpStatusCodeErrors value')

  let httpErrors = defaultConf.getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(200), false, 'default: 200 is not error code')
  t.equal(httpErrors.isErrorCode(500), true, 'default: 500 is error code')
  t.equal(httpErrors.isErrorCode(401), true, 'default: 401 is error code')
  t.equal(httpErrors.isErrorCode(403), true, 'default: 403 is error code')
  t.equal(httpErrors.isErrorCode(404), false, 'default: 404 is not error code')

  process.env['PINPOINT_HTTP_STATUS_CODE_ERRORS'] = '404,500'

  httpErrors = new ConfigBuilder().build().getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(500), true, 'env config: 500 is error code')
  t.equal(httpErrors.isErrorCode(404), true, 'env config: 404 is error code')
  t.equal(httpErrors.isErrorCode(401), false, 'env config: 401 is not error code')
  t.equal(httpErrors.isErrorCode(403), false, 'env config: 403 is not error code')
  delete process.env.PINPOINT_HTTP_STATUS_CODE_ERRORS

  const conf = new ConfigBuilder({ 'plugins': { 'http': { 'errorStatusCodes': '400,401,403,404' } } }).build()
  t.equal(conf.plugins.http.errorStatusCodes, '400,401,403,404', 'json config: httpStatusCodeErrors value')

  httpErrors = conf.getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(400), true, 'json config: 400 is error code')
  t.equal(httpErrors.isErrorCode(401), true, 'json config: 401 is error code')
  t.equal(httpErrors.isErrorCode(403), true, 'json config: 403 is error code')
  t.equal(httpErrors.isErrorCode(404), true, 'json config: 404 is error code')
  t.equal(httpErrors.isErrorCode(500), false, 'json config: 500 is not error code')

  delete process.env.PINPOINT_HTTP_STATUS_CODE_ERRORS
  t.end()
})

test('Logger levels', (t) => {
  const conf = new ConfigBuilder().build()
  t.deepEqual(conf.features.logLevels, {'default-logger': 'WARN', grpcLogger: 'SILENT'}, 'default logger levels is warn and grpcLogger is silent')

  process.env['PINPOINT_LOGGER_LEVELS'] = 'grpc=INFO,sql=WARN,http=INFO'
  const confWithEnv = new ConfigBuilder().build()
  t.deepEqual(confWithEnv.features.logLevels, {'default-logger': 'WARN', grpcLogger: 'SILENT', 'grpc': 'INFO', 'sql': 'WARN', 'http': 'INFO'}, 'logger levels from env is grpc=INFO,sql=WARN,http=INFO')

  process.env['PINPOINT_LOGGER_LEVELS'] = '.nemo=DEBUG'
  const confWithAppender = new ConfigBuilder().build()
  t.deepEqual(confWithAppender.features.logLevels, {'default-logger': 'WARN', grpcLogger: 'SILENT', '.nemo': 'DEBUG'}, 'logger levels from env is .nemo=DEBUG')

  process.env['PINPOINT_LOGGER_LEVELS'] = 'grpc=DEBUG,sql=ERROR,http=TRACE'
  const confWithEnvDebug = new ConfigBuilder().build()
  t.deepEqual(confWithEnvDebug.features.logLevels, {'default-logger': 'WARN', grpcLogger: 'SILENT', 'grpc': 'DEBUG', 'sql': 'ERROR', 'http': 'TRACE'}, 'logger levels from env is grpc=DEBUG,sql=ERROR,http=TRACE')
  t.end()
})

test('ConfigBuilder accumulates the warns of pinpoint-config.json and the handlers', (t) => {
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERNS
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE
  const userDefinedJson = {
    messages: { warns: ['Failed to read or parse pinpoint-config.json'] },
    features: { traceExclusionUrl: { cacheSize: 100 } }
  }

  const conf = new ConfigBuilder().setUserDefinedJson(userDefinedJson).build()

  t.equal(conf.messages.warns.length, 2, 'the handler warn does not replace the pinpoint-config.json warn')
  t.equal(conf.messages.warns[0], 'Failed to read or parse pinpoint-config.json', 'the pinpoint-config.json warn comes first')
  t.true(conf.messages.warns[1].startsWith('You have to set the PINPOINT_TRACE_EXCLUSION_URL_PATTERNS'), 'the traceExclusionUrl warn comes next')
  t.end()
})

test('Config getters return the final names and ids', (t) => {
  const v4 = new ConfigBuilder({ agentId: 'node.app', applicationName: 'appName', serviceName: 'serviceName' }).setUserDefinedJson({}).build()
  t.equal(v4.getAgentId(), v4.agentId, 'getAgentId is the generated v4 agentId')
  t.notEqual(v4.getAgentId(), 'node.app', 'getAgentId is not the configured agentId')
  t.equal(v4.getAgentName(), v4.getAgentId(), 'getAgentName falls back to the agentId')
  t.equal(v4.getApplicationName(), 'appName', 'getApplicationName')
  t.equal(v4.getServiceName(), 'serviceName', 'getServiceName')
  t.equal(v4.getProtocolVersion(), 'v4', 'getProtocolVersion defaults to v4')
  t.equal(v4.isContainerEnvironment(), isContainerEnvironment(), 'isContainerEnvironment follows the container detection')

  const v3 = new ConfigBuilder({ agentId: 'node.app', applicationName: 'appName', serviceName: 'serviceName', collector: { protocolVersion: 'V3' } }).setUserDefinedJson({}).build()
  t.equal(v3.getAgentId(), 'node.app', 'v3 getAgentId is the configured agentId')
  t.equal(v3.getServiceName(), undefined, 'v3 getServiceName is undefined')
  t.equal(v3.getProtocolVersion(), 'v3', 'getProtocolVersion is the normalized v3')
  t.end()
})
