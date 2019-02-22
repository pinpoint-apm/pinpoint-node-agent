const test = require('tape')
const { log, fixture, util } = require('./test-helper')

const config = require('../lib/config')

test('Should be configured with default', function (t) {
  t.plan(1)

  config.clear()
  const conf = config.getConfig()

  t.ok(conf.agentId)
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
