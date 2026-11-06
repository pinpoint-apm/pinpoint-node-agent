/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const { ProcessAgentBuilder } = require('../support/process-agent-builder')
const RecordingDataSender = require('../support/recording-data-sender')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')

test('Should send api meta info', function (t) {
  t.plan(1)
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  agent.dataSender.send(apiMetaInfo)

  t.equal(dataSender.apiMetaInfos()[0], apiMetaInfo, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  agent.dataSender.send(stringMetaInfo)

  t.deepEqual(dataSender.stringMetaInfos().at(-1), stringMetaInfo, "agentInfo is equal in datasender")
})
