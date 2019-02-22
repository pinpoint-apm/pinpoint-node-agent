const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../test-helper')
enableDataSending()

const Trace = require('../../lib/context/trace')
const DataSender = require('../../lib/client/data-sender')
const dataSender = new DataSender(fixture.config)

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

test.onFinish(() => {
  dataSender.closeClient()
})
