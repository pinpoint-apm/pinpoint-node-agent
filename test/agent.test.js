const test = require('tape')
const fixture = require('./fixture')
fixture.config.enabledDataSending = true

const Agent = require('agent')
const agent = new Agent(fixture.config)

// close client connection
setTimeout(() => {
  agent.dataSender.closeClient()
}, 3000)

test('Should send agent info', function (t) {
  t.plan(1)

  t.ok(agent.sendAgentInfo())
})

test('Should api meta info', function (t) {
  t.plan(1)

  t.ok(agent.sendApiMetaInfo())
})
