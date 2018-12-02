const test = require('tape')

const Agent = require('agent')
const fixture = require('./fixture')
fixture.config.enabledDataSending = true

test('Should send agent info', function (t) {
  t.plan(1)

  const agent = new Agent(fixture.config)

  t.ok(agent.sendAgentInfo())
})

test.only('Should api meta info', function (t) {
  t.plan(1)

  const agent = new Agent(fixture.config)

  t.ok(agent.sendApiMetaInfo())
})
