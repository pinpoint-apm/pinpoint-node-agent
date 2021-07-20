/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')


const { fixture } = require('../test-helper')
const Trace = require('../../lib/context/trace')
const dataSenderMock = require('../support/data-sender-mock')
const dataSender = dataSenderMock()
const AgentInfo = require('../../lib/data/dto/agent-info')
const agentInfo = AgentInfo.create(fixture.config, Date.now())
const MethodDescriptor = require('../../lib/context/method-descriptor')
const MethodType = require('../../lib/constant/method-type').MethodType
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')

// const { log, fixture, util, enableDataSending } = require('../test-helper')
// enableDataSending()

// const Trace = require('../../lib/context/trace')
// const dataSenderFactory = require('../../lib/client/data-sender-factory')

// const GRPC_ENABLE = false
// fixture.config['grpcEnable'] = GRPC_ENABLE
// const dataSender = dataSenderFactory.create(fixture.config, agentInfo)

test('Should send agent info', function (t) {
  t.plan(1)

  dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)

  const methodDescriptor = new MethodDescriptor('http', 'Server', 'request', MethodType.WEB_REQUEST, 'Node Server Process')
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

test('Should send string meta info', function (t) {
  t.plan(1)
  dataSender.mockSpan = null

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo, dataSender)
  const spanEventRecorder = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder)
  const span = trace.span

  dataSender.send(span)

  t.equal(dataSender.mockSpan, span, "metaInfo is equal in datasender")
})
