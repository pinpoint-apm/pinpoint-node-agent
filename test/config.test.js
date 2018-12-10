const test = require('tape')
const { log, fixture, util } = require('./test-helper')

const config = require('config')

test('Should be configured with default', function (t) {
  t.plan(1)

  config.clear()
  const conf = config.get()

  t.equal(null, conf.agentId)
})

test('Should be configured with environment variable', function (t) {
  t.plan(1)

  const agentId = 'id-from-env'
  process.env.PINPOINT_AGENT_ID = agentId
  config.clear()
  const conf = config.get()

  t.equal(agentId, conf.agentId)
})

test('Should be configured with argument', function (t) {
  t.plan(1)

  process.env.PINPOINT_AGENT_ID = 'id-from-env'
  const agentId = 'id-from-argument'
  config.clear()
  const conf = config.get({
    agentId
  }, false)

  t.equal(agentId, conf.agentId)
})
