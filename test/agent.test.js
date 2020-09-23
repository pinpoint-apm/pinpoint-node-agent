/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const { log, fixture, util, enableDataSending } = require('./test-helper')
enableDataSending()

test('Should initialize agent', function (t) {
  t.plan(2)

  const agent = require('./support/agent-singleton-mock')
  t.ok(agent)
  t.equal(agent.pinpointClient.agentInfo.agentVersion, '0.6.2', 'agent version from package.json')
})
