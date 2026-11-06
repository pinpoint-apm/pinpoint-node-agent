/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AgentInfo = require('../../../lib/data/dto/agent-info')
const { ConfigBuilder } = require('../../../lib/config-builder')

const generatedAgentIdPattern = /^[A-Za-z0-9_-]{22}$/

test('Should initialize agent', function (t) {
  t.plan(1)

  t.equal(new AgentInfo(buildConfig({}), '1700000000000').agentVersion, '2.0.0', 'agent version from package.json')
})

test('json applicationServiceType and PINPOINT_SERVICE_TYPE are ignored and AgentInfo is NODE 1400', (t) => {
  process.env.PINPOINT_SERVICE_TYPE = '1600'
  const config = buildConfig({ applicationName: 'appName', serviceName: 'serviceName', applicationServiceType: 1500 })
  delete process.env.PINPOINT_SERVICE_TYPE

  t.equal(new AgentInfo(config, '1700000000000').getApplicationServiceType(), 1400, 'AgentInfo applicationServiceType is NODE 1400')
  t.end()
})

test('AgentInfo carries the final names, ids and container of Config', (t) => {
  process.env.KUBERNETES_SERVICE_HOST = 'aaa'
  const config = buildConfig({ applicationName: 'appName', serviceName: 'serviceName' })
  delete process.env.KUBERNETES_SERVICE_HOST

  const agentInfo = new AgentInfo(config, '1700000000000')
  t.match(agentInfo.getAgentId(), generatedAgentIdPattern, 'agentId is the generated v4 agentId')
  t.equal(agentInfo.getAgentId(), config.agentId, 'agentId is the Config agentId')
  t.equal(agentInfo.getAgentName(), config.agentId, 'agentName falls back to agentId')
  t.equal(agentInfo.getApplicationName(), 'appName', 'applicationName')
  t.true(agentInfo.container, 'container')
  t.equal(agentInfo.getAgentStartTime(), '1700000000000', 'agentStartTime is the given agentStartTime')
  t.end()
})

function buildConfig(json) {
  return new ConfigBuilder(json).setUserDefinedJson({}).build()
}
