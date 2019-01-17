const test = require('tape')

const { log, fixture, util, enableDataSending } = require('./test-helper')
enableDataSending()

const Agent = require('../src/agent')
const agent = new Agent(fixture.config)

test('Should send agent info', function (t) {
  t.plan(1)

  t.ok(agent.sendAgentInfo())
})

test('Should api meta info', function (t) {
  t.plan(1)

  t.ok(agent.sendApiMetaInfo())
})

test.onFinish(() => {
  agent.dataSender.closeClient()
})
