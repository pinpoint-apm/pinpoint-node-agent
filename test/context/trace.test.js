const test = require('tape')

const Trace = require('context/trace')
const fixture = require('../fixture')
const util = require('../util')

test('Should begin/end trace block', async function (t) {
  t.plan(2)

  const traceId = fixture.getTraceId()
  const trace = new Trace(traceId)
  const spanEventRecorder = trace.traceBlockBegin()

  t.equal(trace.sequence, 1)

  await util.sleep(11)
  trace.traceBlockEnd()

  console.log('spanEventRecorder.spanEvent.elapsedTime', spanEventRecorder.spanEvent.elapsedTime)
  t.ok(spanEventRecorder.spanEvent.elapsedTime > 10)
})

test('Should push/pop call stack ', function (t) {
  t.plan(2)

  const traceId = fixture.getTraceId()
  const trace = new Trace(traceId)
  trace.traceBlockBegin()
  const spanEventRecorder = trace.traceBlockBegin()
  t.equal(trace.callStack.length, spanEventRecorder.spanEvent.depth)

  trace.traceBlockEnd()
  trace.traceBlockEnd()
  t.equal(trace.callStack.length, 0)
})
