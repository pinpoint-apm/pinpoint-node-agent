/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const agent = require('../support/agent-singleton-mock')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')

test('Should send agent info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const agentInfo = AgentInfo.make(agent.config)
  agent.dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  agent.dataSender.send(apiMetaInfo)

  t.equal(agent.dataSender.mockAPIMetaInfos[0], apiMetaInfo, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  agent.dataSender.send(stringMetaInfo)

  t.deepEqual(agent.dataSender.mockMetaInfo, stringMetaInfo, "agentInfo is equal in datasender")
})
