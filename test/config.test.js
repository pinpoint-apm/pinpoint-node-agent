/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ConfigBuilder } = require('../lib/config-builder')
const path = require('path')

test('Agent ID required field', function (t) {
  t.plan(1)

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  const conf = new ConfigBuilder().build()
  t.true(conf.agentId.length == 16)
})

test('Should be configured with environment variable', function (t) {
  t.plan(1)

  const agentId = 'id-from-env'
  process.env.PINPOINT_AGENT_ID = agentId

  const conf = new ConfigBuilder().build()
  t.equal(agentId, conf.agentId)

  delete process.env.PINPOINT_AGENT_ID
})

test('Should be configured with argument', function (t) {
  t.plan(1)

  process.env.PINPOINT_AGENT_ID = 'id-from-env'

  const conf = new ConfigBuilder({ 'agentId': 'id-from-argument' }).build()
  t.equal(conf.agentId, 'id-from-argument')

  delete process.env.PINPOINT_AGENT_ID
})

test('Should be read from config file', function (t) {
  t.plan(1)

  delete process.env.PINPOINT_COLLECTOR_IP
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERNS
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_PATTERN
  delete process.env.PINPOINT_TRACE_EXCLUSION_URL_CACHE_SIZE

  const expected = Object.assign({}, require('./pinpoint-config-test.json'), { sampling: { rate: 10 } })
  const actual = new ConfigBuilder().setDefaultJson(expected).build()
  t.deepEqual(actual, expected)
})

test('deadline config', (t) => {
  t.plan(1)

  const json = require('../lib/pinpoint-config-default.json')
  const conf = new ConfigBuilder().setDefaultJson(json).build()
  t.equal(conf.collector.deadlineMinutes, 10)
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

// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/util/IdValidateUtils.java
// public static final String ID_PATTERN_VALUE = '[a-zA-Z0-9\\._\\-]+';
// https://github.com/pinpoint-apm/pinpoint/blob/master/bootstraps/bootstrap/src/main/java/com/navercorp/pinpoint/bootstrap/IdValidator.java
// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/PinpointConstants.java
// public final class PinpointConstants {
//   public static final int APPLICATION_NAME_MAX_LEN = 24;
//   public static final int AGENT_ID_MAX_LEN = 24;
// }
test('Agent ID length check', (t) => {
  process.env['PINPOINT_AGENT_ID'] = 'agentId'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appication-name'
  process.env['PINPOINT_AGENT_NAME'] = 'agent-name'
  let given = new ConfigBuilder().build()
  t.true(given.enable, 'configuration agentId, Name, ApplicationName enable agent id')
  t.equal(given.agentName, 'agent-name', 'agent name is agent name')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME
  delete process.env.PINPOINT_AGENT_NAME

  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  given = new ConfigBuilder().build()
  t.true(given.enable, 'maxlength agentID and application Name')
  t.equal(given.messages, undefined, 'no error message')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdageE'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'maxlength agentID error')
  t.equal(given.messages.errors[0], 'Agent ID is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappicationE'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'maxlength application Name error')
  t.equal(given.messages.errors[0], 'Application Name is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_AGENT_ID'] = '~'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'invalide agent ID')
  t.equal(given.messages.errors[0], 'Agent ID has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = '~'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'invalide application name')
  t.equal(given.messages.errors[0], 'Application Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: ~. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  given = new ConfigBuilder().build()
  t.true(given.enable, 'agent ID nullable test')
  t.equal(given.applicationName, 'appicationnameappication', 'application name is appicationnameappication')
  t.equal(given.agentId.length, 16, 'random generated agent ID length is 16')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  given = new ConfigBuilder().build()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.false(given.agentName, 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, undefined, 'Application Name is required and only set from developer')
  t.equal(given.messages.errors[0], 'Application Name is required. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent name'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
  t.equal(given.messages.errors[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent?name'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent?name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
  t.equal(given.messages.errors[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent?name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
  t.equal(given.messages.errors[0], 'Agent Name is too long (max 255 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage'
  given = new ConfigBuilder().build()
  t.true(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')
  t.equal(given.messages, undefined, 'no error message')
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  t.end()
})

test('Agent Name validation', (t) => {
  t.plan(6)

  // too long (256 chars)
  process.env.PINPOINT_AGENT_ID = 'agent-valid'
  process.env.PINPOINT_APPLICATION_NAME = 'application-valid'
  process.env.PINPOINT_AGENT_NAME = 'a'.repeat(256)
  let given = new ConfigBuilder().build()
  t.false(given.enable, 'agent name over 255 disables agent')
  t.equal(given.messages.errors[0], 'Agent Name is too long (max 255 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')

  // invalid characters
  process.env.PINPOINT_AGENT_NAME = 'agent?name'
  given = new ConfigBuilder().build()
  t.false(given.enable, 'agent name with invalid chars disables agent')
  t.equal(given.messages.errors[0], 'Agent Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: agent?name. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')

  // empty allowed (optional)
  process.env.PINPOINT_AGENT_NAME = ''
  given = new ConfigBuilder().build()
  t.true(given.enable, 'empty agent name is allowed')
  t.equal(given.agentName, undefined, 'empty agent name not set')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME
  delete process.env.PINPOINT_AGENT_NAME
})

test('Agent ID and Application Name multiple errors', (t) => {
  process.env.PINPOINT_AGENT_ID = 'agentIdagentIdagentIdageE' // 25 chars -> too long
  process.env.PINPOINT_APPLICATION_NAME = 'appicationnameappication?' // invalid char

  const given = new ConfigBuilder().build()
  t.false(given.enable, 'config disabled when multiple id/app errors')
  t.ok(given.messages?.errors?.length >= 2, 'aggregates multiple errors')
  t.equal(given.messages.errors[0], 'Agent ID is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  t.equal(given.messages.errors[1], 'Application Name is too long (max 24 characters). See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')
  t.equal(given.messages.errors[2], 'Application Name has invalid characters; allowed [a-zA-Z0-9._-]. Value: appicationnameappication?. See https://github.com/pinpoint-apm/pinpoint-node-agent?tab=readme-ov-file#3-configuration-with-environment-variables')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  t.end()
})

test('sampling Rate', (t) => {
  let conf = new ConfigBuilder().build()
  t.equal(conf.sampling.rate, 10, 'default sampling rate is 10')

  conf = new ConfigBuilder({ 'sampling': { 'rate': 20} }).build()
  t.equal(conf.sampling.rate, 20, 'sampling rate is 20')

  t.end()
})

test('uri config is preserved', (t) => {
  t.plan(2)

  const defaultJson = Object.assign({}, require('../lib/pinpoint-config-default.json'), {
    agentId: 'agent-from-test',
    applicationName: 'app-from-test',
    // keep existing service type from default json
    features: Object.assign({}, require('../lib/pinpoint-config-default.json').features, {
      uriStats: {
        httpMethod: true,
        capacity: 500
      }
    })
  })

  const conf = new ConfigBuilder().setDefaultJson(defaultJson).build()
  t.equal(conf.features.uriStats.capacity, 500, 'uriStats capacity should be preserved')
  t.equal(conf.features.uriStats.httpMethod, true, 'uriStats httpMethod flag should be preserved')
})

test('HTTP Status Code Errors', (t) => {
  let conf = new ConfigBuilder().build()
  t.equal(conf.plugins.http.errorStatusCodes, '5xx,401,403', 'default http status code errors is 5xx,401,403')

  const errors = conf.getHttpStatusCodeErrors()
  t.equal(errors.isErrorCode(500), true, '500 is error code')
  t.equal(errors.isErrorCode(200), false, '200 is not error code')
  t.equal(errors.isErrorCode(401), true, '401 is error code')
  t.equal(errors.isErrorCode(403), true, '403 is error code')
  t.end()
})

test('HTTP Status Code Errors with config changes', (t) => {
  let httpErrors = new ConfigBuilder().build().getHttpStatusCodeErrors()
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