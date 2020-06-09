const test = require('tape')
const axios = require('axios')


const { fixture } = require('../test-helper')
const Trace = require('../../lib/context/trace')
const dataSenderMock = require('../support/data-sender-mock')
const dataSender = {
  sendSpan: function(span) {
    this.mockSpan = span
  },
  sendAgentInfo: function(agentInfo) {
    this.mockAgentInfo = agentInfo
  },
  sendStringMetaInfo: function(metaInfo) {
    this.mockMetaInfo = metaInfo
  }
}

// const { log, fixture, util, enableDataSending } = require('../test-helper')
// enableDataSending()

// const Trace = require('../../lib/context/trace')
// const AgentInfo = require('../../lib/data/dto/agent-info')
// const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
// const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
// const MethodDescriptor = require('../../lib/context/method-descriptor')
// const MethodType = require('../../lib/constant/method-type').MethodType
// const dataSenderFactory = require('../../lib/client/data-sender-factory')

// const GRPC_ENABLE = false
// fixture.config['grpcEnable'] = GRPC_ENABLE
// const agentInfo = AgentInfo.create(fixture.config, Date.now())
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

  t.equal(dataSender.mockSpan, span, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  dataSender.send(stringMetaInfo)

  t.deepEqual(dataSender.mockAgentInfo, fixture.getAgentInfo(), "agentInfo is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo, dataSender)
  const spanEventRecorder = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder)
  const span = trace.span

  dataSender.send(span)

  t.equal(dataSender.mockMetaInfo, metaInfo, "metaInfo is equal in datasender")
})
