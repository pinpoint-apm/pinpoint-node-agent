/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log } = require('./test-helper')
const config = require('../lib/config')
const HttpStatusCodeErrorsBuilder = require('../lib/instrumentation/http/http-status-code-errors-builder')

test('Agent ID required field', function (t) {
  t.plan(1)

  config.clear()
  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  const conf = config.getConfig()

  t.true(conf.agentId.length == 16)
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
    'agent-id': agentId
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
  t.equal(result.streamDeadlineMinutesClientSide, 10)
})

test('main moudle path', (t) => {
  config.clear()
  const conf = config.readRootConfigFile()
  t.deepEqual(conf, {}, 'configuration is null object')
  let actual = config.getMainModulePath(require)

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

// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/util/IdValidateUtils.java
// public static final String ID_PATTERN_VALUE = '[a-zA-Z0-9\\._\\-]+';
// https://github.com/pinpoint-apm/pinpoint/blob/master/bootstraps/bootstrap/src/main/java/com/navercorp/pinpoint/bootstrap/IdValidator.java
// https://github.com/pinpoint-apm/pinpoint/blob/master/commons/src/main/java/com/navercorp/pinpoint/common/PinpointConstants.java
// public final class PinpointConstants {
//   public static final int APPLICATION_NAME_MAX_LEN = 24;
//   public static final int AGENT_ID_MAX_LEN = 24;
// }
test('Agent ID length check', (t) => {
  config.clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentId'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appication-name'
  process.env['PINPOINT_AGENT_NAME'] = 'agent-name'

  let given = config.getConfig()
  t.true(given.enable, 'configuration agentId, Name, ApplicationName enable agent id')
  t.equal(given.agentName, 'agent-name', 'agent name is agent name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = config.getConfig()
  t.true(given.enable, 'maxlength agentID and application Name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdageE'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = config.getConfig()
  t.false(given.enable, 'maxlength agentID error')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappicationE'

  given = config.getConfig()
  t.false(given.enable, 'maxlength application Name error')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_AGENT_ID'] = '~'
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = config.getConfig()
  t.false(given.enable, 'invalide agent ID')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_AGENT_ID'] = 'agentIdagentIdagentIdage'
  process.env['PINPOINT_APPLICATION_NAME'] = '~'

  given = config.getConfig()
  t.false(given.enable, 'invalide application name')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'

  given = config.getConfig()
  t.true(given.enable, 'agent ID nullable test')
  t.equal(given.applicationName, 'appicationnameappication', 'application name is appicationnameappication')
  t.equal(given.agentId.length, 16, 'random generated agent ID length is 16')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  given = config.getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.false(given.agentName, 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, undefined, 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent name'
  given = config.getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agent?name'
  given = config.getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agent?name', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen'
  given = config.getConfig()
  t.false(given.enable, 'Application Name must be set')
  t.true(given.agentId.length === 16, 'Agent ID was generated randomly')
  t.equal(given.agentName, 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagen', 'Agent Name is optional value and only set from developer')
  t.equal(given.applicationName, 'appicationnameappication', 'Application Name is required and only set from developer')

  delete process.env.PINPOINT_AGENT_ID
  delete process.env.PINPOINT_AGENT_NAME
  delete process.env.PINPOINT_APPLICATION_NAME

  config.clear()
  process.env['PINPOINT_APPLICATION_NAME'] = 'appicationnameappication'
  process.env['PINPOINT_AGENT_NAME'] = 'agentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameagentnameage'
  given = config.getConfig()
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
  config.clear()

  let given = config.getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'default value is false')

  config.clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = ''
  given = config.getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'default value is true validation')

  config.clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = 'false'
  given = config.getConfig()
  t.false(given.traceLocationAndFileNameOfCallSite, 'false value is false')

  config.clear()
  process.env['PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE'] = 'true'
  given = config.getConfig()
  t.true(given.traceLocationAndFileNameOfCallSite, 'true value is true')
  delete process.env.PINPOINT_TRACE_LOCATION_AND_FILENAME_OF_CALL_SITE

  config.clear()
  process.env['PINPOINT_PROFILER_SQL_STAT'] = 'true'
  given = config.getConfig()
  t.true(given.profilerSqlStat, 'profilerSqlStat is true')
  delete process.env.PINPOINT_PROFILER_SQL_STAT
  t.end()
})

test('sampling Rate', (t) => {
  config.clear()
  let conf = require('../lib/config').getConfig()
  t.equal(conf.sampleRate, 10, 'default sampling rate is 10')

  config.clear()
  conf = require('../lib/config').getConfig({ 'sampling': { 'rate': 20} })
  t.equal(conf.sampleRate, 20, 'sampling rate is 20')

  t.end()
})

test('HTTP Status Code Errors', (t) => {
  config.clear()
  let conf = require('../lib/config').getConfig()
  t.equal(conf.httpStatusCodeErrors, '5xx,401,403', 'default http status code errors is 5xx,401,403')

  const errors = new HttpStatusCodeErrorsBuilder(conf.httpStatusCodeErrors).build()
  t.equal(errors.isErrorCode(500), true, '500 is error code')
  t.equal(errors.isErrorCode(200), false, '200 is not error code')
  t.equal(errors.isErrorCode(401), true, '401 is error code')
  t.equal(errors.isErrorCode(403), true, '403 is error code')
  t.end()
})