/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { clear, getConfig, readConfigJson, readRootConfigFile, getMainModulePath } = require('../lib/config')
const { HttpStatusCodeErrorsBuilder, getHttpStatusCodeErrors, clearHttpStatusCodeErrors } = require('../lib/instrumentation/http/http-status-code-errors-builder')
const log = require('../lib/utils/log/logger')

test('Agent ID required field', function (t) {
  t.plan(1)

  clear()
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  const conf = getConfig()

  t.true(conf.agentId.length == 16)
})

test('Should be configured with environment variable', function (t) {
  t.plan(1)

  const agentId = 'id-from-env'
  process.env.PINPOINT_AGENT_ID = agentId
  clear()
  const conf = getConfig()

  t.equal(agentId, conf.agentId)
})

test('Should be configured with argument', function (t) {
  t.plan(1)

  process.env.PINPOINT_AGENT_ID = 'id-from-env'
  clear()
  const conf = getConfig({
    'agent-id': 'id-from-argument'
  }, false)

  t.equal('id-from-argument', conf.agentId)
})

test('Should be read from config file', function (t) {
  t.plan(1)

  const testConfig = require('./pinpoint-config-test')
  const result = readConfigJson(testConfig)
  log.debug(result)
  t.ok(result)
})

test('deadline config', (t) => {
  t.plan(1)

  const json = require('../lib/pinpoint-config-default')
  const result = readConfigJson(json)
  t.equal(result.streamDeadlineMinutesClientSide, 10)
})

test('main module path', (t) => {
  clear()
  const conf = readRootConfigFile()
  t.deepEqual(conf, {}, 'configuration is null object')
  let actual = getMainModulePath(require)

  actual = getMainModulePath({})
  t.true(actual === undefined, 'getMainModulePath({}) return value is undefined')

  actual = getMainModulePath()
  t.true(actual === undefined, 'getMainModulePath() return value is undefined')

  actual = getMainModulePath(null)
  t.true(actual === undefined, 'getMainModulePath(null) return value is undefined')

  actual = getMainModulePath({ main: {} })
  t.true(actual === undefined, 'getMainModulePath({ main: {} }) return value is undefined')

  actual = getMainModulePath({ main: { filename: '/test' } })
  t.equal(actual, '/', 'getMainModulePath({ main: { filename: \' / test\' } }) return value is /')

  actual = getMainModulePath({ main: { filename: '/test/test1' } })
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
  clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentId'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appication-name'
  process.env['PINPOINT_AGENT_NAME'] = 'agent-name'

  let given = getConfig()
  t.true(given.enable, 'configuration agentId, Name, ApplicationName enable agent id')
  t.equal(given.agentName, 'agent-name', 'agent name is agent name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = getConfig()
  t.true(given.enable, 'maxlength agentID and application Name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdageE'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = getConfig()
  t.false(given.enable, 'maxlength agentID error')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappicationE'

  given = getConfig()
  t.false(given.enable, 'maxlength application Name error')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_AGENT_ID'] = '~'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = getConfig()
  t.false(given.enable, 'invalide agent ID')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = '~'

  given = getConfig()
  t.false(given.enable, 'invalide application name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = getConfig()
  t.true(given.enable, 'agent ID nullable test')
  t.equal(given.applicationName, 'appicationnameappication', 'application name is appicationnameappication')
  t.equal(given.agentId.length, 16, 'random generated agent ID length is 16')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  given = getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.false(given.agentName, 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, undefined, 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent name'
  given = getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent?name'
  given = getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent?name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen'
  given = getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage'
  given = getConfig()
  t.true(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  t.end()
})

test('callSite config', (t) => {
  clear()

  let given = getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'default value is false')

  clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = ''
  given = getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'default value is true validation')

  clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = 'false'
  given = getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'false value is false')

  clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = 'true'
  given = getConfig()
  t.true(given.traceLocationAndFileNameOfCallSite, 'true value is true')
  delete process.env.PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE

  clear()
  process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'
  given = getConfig()
  t.true(given.profilerSqlStat, 'profilerSqlStat is true')
  delete process.env.PINPOINT_PROFILER_SQL_STAT
  t.end()
})

test('sampling Rate', (t) => {
  clear()
  let conf = require('../lib/config').getConfig()
  t.equal(conf.sampleRate, 10, 'default sampling rate is 10')

  clear()
  conf = require('../lib/config').getConfig({ 'sampling': { 'rate': 20} })
  t.equal(conf.sampleRate, 20, 'sampling rate is 20')

  t.end()
})

test('HTTP Status Code Errors', (t) => {
  clear()
  let conf = require('../lib/config').getConfig()
  t.equal(conf.httpStatusCodeErrors, '5xx,401,403', 'default http status code errors is 5xx,401,403')

  const errors = new HttpStatusCodeErrorsBuilder(conf.httpStatusCodeErrors).build()
  t.equal(errors.isErrorCode(500), true, '500 is error code')
  t.equal(errors.isErrorCode(200), false, '200 is not error code')
  t.equal(errors.isErrorCode(401), true, '401 is error code')
  t.equal(errors.isErrorCode(403), true, '403 is error code')
  t.end()
})

test('HTTP Status Code Errors with config changes', (t) => {
  clear()
  clearHttpStatusCodeErrors()

  let httpErrors = getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(500), true, 'default: 500 is error code')
  t.equal(httpErrors.isErrorCode(401), true, 'default: 401 is error code')
  t.equal(httpErrors.isErrorCode(403), true, 'default: 403 is error code')
  t.equal(httpErrors.isErrorCode(404), false, 'default: 404 is not error code')

  clear()
  clearHttpStatusCodeErrors()
  process.env['PINPOINT_HTTP_STATUS_CODE_ERRORS'] = '404,500'

  httpErrors = getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(500), true, 'env config: 500 is error code')
  t.equal(httpErrors.isErrorCode(404), true, 'env config: 404 is error code')
  t.equal(httpErrors.isErrorCode(401), false, 'env config: 401 is not error code')
  t.equal(httpErrors.isErrorCode(403), false, 'env config: 403 is not error code')

  clear()
  clearHttpStatusCodeErrors()
  delete process.env.PINPOINT_HTTP_STATUS_CODE_ERRORS

  const customConfig = { 'http-status-code': { 'errors': '400,401,403,404' } }
  const conf = getConfig(customConfig)
  t.equal(conf.httpStatusCodeErrors, '400,401,403,404', 'json config: httpStatusCodeErrors value')

  httpErrors = getHttpStatusCodeErrors()
  t.equal(httpErrors.isErrorCode(400), true, 'json config: 400 is error code')
  t.equal(httpErrors.isErrorCode(401), true, 'json config: 401 is error code')
  t.equal(httpErrors.isErrorCode(403), true, 'json config: 403 is error code')
  t.equal(httpErrors.isErrorCode(404), true, 'json config: 404 is error code')
  t.equal(httpErrors.isErrorCode(500), false, 'json config: 500 is not error code')

  delete process.env.PINPOINT_HTTP_STATUS_CODE_ERRORS
  clear()
  clearHttpStatusCodeErrors()
  t.end()
})

test('Logger levels', (t) => {
  clear()
  const conf = require('../lib/config').getConfig()
  t.deepEqual(conf.loggerLevels, {'default-logger': 'WARN'}, 'default logger levels is =warn')

  clear()
  process.env['PINPOINT_LOGGER_LEVELS'] = 'grpc=INFO,sql=WARN,http=INFO'
  const confWithEnv = require('../lib/config').getConfig()
  t.deepEqual(confWithEnv.loggerLevels, {'grpc': 'INFO', 'sql': 'WARN', 'http': 'INFO'}, 'logger levels from env is grpc=INFO,sql=WARN,http=INFO')

  clear()
  process.env['PINPOINT_LOGGER_LEVELS'] = '.nemo=DEBUG'
  const confWithAppender = require('../lib/config').getConfig()
  t.deepEqual(confWithAppender.loggerLevels, {'.nemo': 'DEBUG'}, 'logger levels from env is .nemo=DEBUG')

  clear()
  process.env['PINPOINT_LOGGER_LEVELS'] = 'grpc=DEBUG,sql=ERROR,http=TRACE'
  const confWithEnvDebug = require('../lib/config').getConfig()
  t.deepEqual(confWithEnvDebug.loggerLevels, {'grpc': 'DEBUG', 'sql': 'ERROR', 'http': 'TRACE'}, 'logger levels from env is grpc=DEBUG,sql=ERROR,http=TRACE')
  t.end()
})