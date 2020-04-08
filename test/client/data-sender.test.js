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

test('Should send span', function (t) {
  t.plan(1)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo)
  const spanEventRecorder1 = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder1)
  const span = trace.span

  dataSender.sendSpan(span)

  t.equal(dataSender.mockSpan, span, "span is equal in datasender")
})

test('Should send agent info', function (t) {
  t.plan(1)

  dataSender.sendAgentInfo(fixture.getAgentInfo())

  t.deepEqual(dataSender.mockAgentInfo, fixture.getAgentInfo(), "agentInfo is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)

  const metaInfo = {
    agentId: fixture.getAgentInfo().agentId,
    agentStartTime: fixture.getAgentInfo().agentStartTime,
    stringId: 1,
    stringValue: 'InternalServerError',
  }

  dataSender.sendStringMetaInfo(metaInfo)


  t.equal(dataSender.mockMetaInfo, metaInfo, "metaInfo is equal in datasender")
})

