const test = require('tape')

const Trace = require('context/trace')
const fixture = require('../fixture')
const util = require('../util')

test('Should begin/end trace block', async function (t) {
  t.plan(2)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo)
  const spanEventRecorder = trace.traceBlockBegin()

  t.equal(trace.sequence, 1)

  await util.sleep(200)
  trace.traceBlockEnd(spanEventRecorder)

  console.log('spanEventRecorder.spanEvent.elapsedTime', spanEventRecorder.spanEvent.elapsedTime)
  t.ok(spanEventRecorder.spanEvent.elapsedTime > 100)
})

test('Should push/pop call stack ', function (t) {
  t.plan(2)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo)

  const spanEventRecorder1 = trace.traceBlockBegin()
  const spanEventRecorder2 = trace.traceBlockBegin()
  t.equal(trace.callStack.length, 2)

  trace.traceBlockEnd(spanEventRecorder2)
  trace.traceBlockEnd(spanEventRecorder1)
  t.equal(trace.callStack.length, 0)
})
