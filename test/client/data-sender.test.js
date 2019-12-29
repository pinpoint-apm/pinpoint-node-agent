const test = require('tape')
const axios = require('axios')


const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const Trace = require('../../lib/context/trace')
const DataSender = require('../../lib/client/data-sender')
const AgentInfo = require('../../lib/data/dto/agent-info')
const dataSenderFactory = require('../../lib/client/data-sender-factory')


test('Should send span', function (t) {
  t.plan(1)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo)
  const spanEventRecorder1 = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder1)
  const span = trace.span

  dataSender.sendSpan(span)

  t.ok(dataSender)
})

test.only('Should send agent info', function (t) {
  t.plan(1)

  const agentInfo = AgentInfo.create(fixture.config, Date.now())
  const dataSender = dataSenderFactory.create(fixture.config, agentInfo)
  dataSender.send(agentInfo)

  t.ok(true)
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


  t.ok(dataSender)
})

