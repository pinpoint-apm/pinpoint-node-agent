const test = require('tape')

const { log, fixture, util, enableDataSending } = require('./test-helper')
enableDataSending()

test('Should initialize agent', function (t) {
  t.plan(2)

  const agent = require('./support/agent-singleton-mock')
  t.ok(agent)
  t.equal(agent.pinpointClient.mockAgentInfo.agentVersion, '0.5.2', 'agent version from package.json')
})
