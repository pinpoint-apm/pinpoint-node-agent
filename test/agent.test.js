/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AgentInfo = require('../lib/data/dto/agent-info')

test('Should initialize agent', function (t) {
  t.plan(2)

  const agent = require('./support/agent-singleton-mock')
  t.ok(agent)
  t.equal(new AgentInfo(agent.getConfig(), agent.agentStartTime).agentVersion, '2.0.0', 'agent version from package.json')
})