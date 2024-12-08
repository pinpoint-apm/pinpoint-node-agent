/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

require('../support/agent-singleton-mock')
const { fixture } = require('../test-helper')
const dataSenderMock = require('../support/data-sender-mock')
const dataSender = dataSenderMock()
const AgentInfo = require('../../lib/data/dto/agent-info')
const agentInfo = AgentInfo.create(fixture.config, Date.now())
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')

test('Should send agent info', function (t) {
  t.plan(1)

  dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)

  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  dataSender.send(apiMetaInfo)

  t.equal(dataSender.mockAPIMetaInfos[0], apiMetaInfo, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  dataSender.send(stringMetaInfo)

  t.deepEqual(dataSender.mockMetaInfo, stringMetaInfo, "agentInfo is equal in datasender")
})
