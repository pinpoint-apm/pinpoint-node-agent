/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

test('Should initialize agent', function (t) {
  t.plan(2)

  const agent = require('./support/agent-singleton-mock')
  t.ok(agent)
  t.equal(agent.agentInfo.agentVersion, '1.4.0', 'agent version from package.json')
})