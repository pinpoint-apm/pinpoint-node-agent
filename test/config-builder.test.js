/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../lib/config-builder')
const { isContainerEnvironment } = require('../lib/support/container-environment')

test('Should be read from config file', function (t) {
  t.plan(2)

  delete process.env.PINPOINT_COLLECTOR_IP
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERNS
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  const testJson = require('./fixtures/pinpoint-config-test.json')
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

test('should return the string value when the env value is string type', function(t) {
  process.env['PINPOINT_COLLECTOR_IP'] = "192.168.78.79"
  process.env['PINPOINT_LOGGER_LEVELS'] = "default-logger=DEBUG"

  const given = new ConfigBuilder().build()
  t.equal(given.collector.ip, "192.168.78.79", "given PINPOINT_COLLECTOR_IP env, should equal config")
  t.equal(given.features.logLevels['default-logger'], "DEBUG", "given PINPOINT_LOGGER_LEVELS env, should equal config")

  delete process.env.PINPOINT_COLLECTOR_IP
  delete process.env.PINPOINT_LOGGER_LEVELS

  t.end()
})

test('should return the number value when the env value is number type', function(t) {
  process.env['PINPOINT_COLLECTOR_TCP_PORT'] = "9894"
  process.env['PINPOINT_COLLECTOR_STAT_PORT'] = "9895"
  process.env['PINPOINT_COLLECTOR_SPAN_PORT'] = "9896"
  process.env['PINPOINT_SAMPLING_RATE'] = "10"

  const given = givenDefaultIdAndName()
  t.equal(given.collector.tcpPort, 9894, 'given PINPOINT_COLLECTOR_TCP_PORT env, should equal config')
  t.equal(given.collector.statPort, 9895, 'given PINPOINT_COLLECTOR_STAT_PORT env, should equal config')
  t.equal(given.collector.spanPort, 9896, 'given PINPOINT_COLLECTOR_SPAN_PORT env, should equal config')
  t.equal(given.sampling.rate, 10, 'given PINPOINT_SAMPLING_RATE env, should equal config')

  delete process.env.PINPOINT_COLLECTOR_TCP_PORT
  delete process.env.PINPOINT_COLLECTOR_STAT_PORT
  delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
  delete process.env.PINPOINT_SAMPLING_RATE

  t.end()
})

test('span batch env values set collector.spanBatch', function(t) {
  process.env['PINPOINT_SPAN_BATCH_SIZE'] = "50"
  process.env['PINPOINT_SPAN_BATCH_DEADLINE_MILLIS'] = "300"
  process.env['PINPOINT_SPAN_BATCH_MAX_REQUESTS'] = "5"

  const given = givenDefaultIdAndName()
  t.deepEqual(given.getSpanBatch(), { size: 50, deadlineMillis: 300, maxRequests: 5 }, 'given PINPOINT_SPAN_BATCH_* env, should equal config')

  delete process.env.PINPOINT_SPAN_BATCH_SIZE
  delete process.env.PINPOINT_SPAN_BATCH_DEADLINE_MILLIS
  delete process.env.PINPOINT_SPAN_BATCH_MAX_REQUESTS

  t.end()
})

test('should return the false value when the env value is boolean type', function(t) {
  process.env['PINPOINT_SAMPLING'] = "false"
  process.env['PINPOINT_ENABLE'] = "false"

  const given = new ConfigBuilder().build()
  t.equal(given.sampling.enable, false, 'given PINPOINT_SAMPLING env, should equal config')
  t.equal(given.enable, false, 'given PINPOINT_ENABLE env, should equal config')

  delete process.env.PINPOINT_SAMPLING
  delete process.env.PINPOINT_ENABLE

  t.end()
})

test('should not exist in the process.env property when you do not set an environment variable', function(t) {
  delete process.env.PINPOINT_COLLECTOR_IP
  delete process.env.PINPOINT_LOGGER_LEVELS

  delete process.env.PINPOINT_SAMPLING
  delete process.env.PINPOINT_ENABLE

  delete process.env.PINPOINT_COLLECTOR_TCP_PORT
  delete process.env.PINPOINT_COLLECTOR_STAT_PORT
  delete process.env.PINPOINT_COLLECTOR_SPAN_PORT
  delete process.env.PINPOINT_SAMPLING_RATE

  const given = givenDefaultIdAndName()
  t.equal(given.collector.ip, "localhost", "No set PINPOINT_COLLECTOR_IP env, should equal default config")

  t.equal(given.sampling.enable, true, 'No set PINPOINT_SAMPLING env, should equal default config')
  t.equal(given.enable, true, 'No set PINPOINT_ENABLE env, should equal default config')

  t.equal(given.collector.tcpPort, 9991, 'No set PINPOINT_COLLECTOR_TCP_PORT env, should equal default config')
  t.equal(given.collector.statPort, 9992, 'No set PINPOINT_COLLECTOR_STAT_PORT env, should equal default config')
  t.equal(given.collector.spanPort, 9993, 'No set PINPOINT_COLLECTOR_SPAN_PORT env, should equal default config')
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

  process.env['PINPOINT_HTTP_STATUS_CODE_ERRORS'] = '404,500'

  const httpErrors = new ConfigBuilder().build().getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(500), true, 'env config: 500 is error code')
  t.equal(httpErrors.isErrorCode(404), true, 'env config: 404 is error code')
  t.equal(httpErrors.isErrorCode(401), false, 'env config: 401 is not error code')
  t.equal(httpErrors.isErrorCode(403), false, 'env config: 403 is not error code')
  delete process.env.PINPOINT_HTTP_STATUS_CODE_ERRORS

  const conf = new ConfigBuilder({ 'plugins': { 'http': { 'errorStatusCodes': '400,401,403,404' } } }).build()
  t.equal(conf.plugins.http.errorStatusCodes, '400,401,403,404', 'json config: httpStatusCodeErrors value')

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

test('config object exclusion URL', (t) => {
  let config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/test.jpg"]
      }
    }
  })
  t.deepEqual(new ConfigBuilder(config).build().features.traceExclusionUrl.patterns, ["/test.jpg"])
  delete config["features"]["traceExclusionUrl"]

  config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/??/a", "/*bla/test"]
      }
    }
  })
  t.deepEqual(new ConfigBuilder(config).build().features.traceExclusionUrl.patterns, ["/??/a", "/*bla/test"])
  delete config["features"]["traceExclusionUrl"]

  t.end()
})

test('config env exclusion URL', (t) => {
  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test"
  t.deepEqual(new ConfigBuilder().build().features.traceExclusionUrl.patterns, ["/test"])

  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test, test"
  t.deepEqual(new ConfigBuilder().build().features.traceExclusionUrl.patterns, ["/test", "test"])
  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/test, test,tes?"
  t.deepEqual(new ConfigBuilder().build().features.traceExclusionUrl.patterns, ["/test", "test", "tes?"])

  t.end()
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
})

test('config env exclusion URL cache size', (t) => {
  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
  let conf = new ConfigBuilder().build()
  t.true(conf.features.traceExclusionUrl.cacheSize === 100, `config.features.traceExclusionUrl.cacheSize default value 100 ENV In undefined case`)
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/tes?"
  process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
  conf = new ConfigBuilder().build()
  t.equal(conf.features.traceExclusionUrl.cacheSize, 100, 'config.features.traceExclusionUrl.cacheSize default 100')
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
  conf = new ConfigBuilder().build()
  t.true(typeof conf.features.traceExclusionUrl.patterns === 'undefined', 'when only set config.features.traceExclusionUrl.cacheSize ENV, agent.getConfig().features.traceExclusionUrl.patterns undefined case')
  t.true(typeof conf.features.traceExclusionUrl.cacheSize === 'undefined', 'when only set config.features.traceExclusionUrl.cacheSize ENV, agent.getConfig().features.traceExclusionUrl.cacheSize undefined case')
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/test?"
  conf = new ConfigBuilder().build()
  t.true(conf.features.traceExclusionUrl.cacheSize === 100, 'config.features.traceExclusionUrl.cacheSize ENV undefined case and patterns set, default 100 cache size')
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN

  process.env['PINPOINT_TRACE_EXCLUSION_URL_PATTERN'] = "/heath_check?/**,/test?"
  process.env['PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE'] = "0"
  conf = new ConfigBuilder().build()
  t.equal(conf.features.traceExclusionUrl.cacheSize, 100, 'when sampling is true, config.features.traceExclusionUrl.cacheSize default 100')
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  t.end()
})

test('config object exclusion URL cache size', (t) => {
  let config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/heath_check?/**", "/tes?"]
      }
    }
  })
  let conf = new ConfigBuilder(config).build()
  t.true(conf.features.traceExclusionUrl.cacheSize === 100, 'config.features.traceExclusionUrl.cacheSize ENV undefined case')

  config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/heath_check?/**", "/tes?"],
        "cacheSize": 0
      }
    }
  })
  conf = new ConfigBuilder(config).build()
  t.equal(conf.features.traceExclusionUrl.cacheSize, 100, 'config.features.traceExclusionUrl.cacheSize default 100')

  config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "cacheSize": 0
      }
    }
  })
  conf = new ConfigBuilder(config).build()
  t.true(typeof conf.features.traceExclusionUrl.patterns === 'undefined', 'when only set config.features.traceExclusionUrl.cacheSize ENV, agent.getConfig().features.traceExclusionUrl.patterns undefined case')
  t.true(typeof conf.features.traceExclusionUrl.cacheSize === 'undefined', 'when only set config.features.traceExclusionUrl.cacheSize ENV, agent.getConfig().features.traceExclusionUrl.cacheSize undefined case')

  config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/heath_check?/**", "/test?"]
      }
    }
  })
  conf = new ConfigBuilder(config).build()
  t.true(conf.features.traceExclusionUrl.cacheSize === 100, 'when sampling is true, config.features.traceExclusionUrl.cacheSize ENV undefined case')

  config = require('./fixtures/pinpoint-config-test.json')
  config = Object.assign({}, config, {
    "features": {
      "traceExclusionUrl": {
        "patterns": ["/heath_check?/**", "/test?"],
        "cacheSize": 0
      }
    }
  })
  conf = new ConfigBuilder(config).build()
  t.equal(conf.features.traceExclusionUrl.cacheSize, 100, 'when sampling is true, config.features.traceExclusionUrl.cacheSize default 100')

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

function givenDefaultIdAndName() {
  process.env['PINPOINT_APPLICATION_NAME'] = "appName"
  process.env['PINPOINT_SERVICE_NAME'] = "serviceName"

  const given = new ConfigBuilder().build()

  delete process.env.PINPOINT_APPLICATION_NAME
  delete process.env.PINPOINT_SERVICE_NAME

  return given
}
