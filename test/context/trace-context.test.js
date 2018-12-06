const test = require('tape')
const fixture = require('../fixture')
const util = require('../util')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const TraceContext = require('context/trace-context')
const ExpressMethodDescritpor = require('constant/method-descriptor').ExpressMethodDescritpor

test('Should create continued trace and add span info', function (t) {
  t.plan(2)

  const transactionId = fixture.getTransactionId()
  const traceId = fixture.getTraceId(transactionId)
  const traceContext = TraceContext.init(fixture.getAgentInfo())

  const trace = traceContext.continueTraceObject(traceId)

  t.equal(traceContext.currentTraceObject().traceId.transactionId.toString(), transactionId.toString())

  trace.spanRecorder.recordServiceType(ServiceTypeCode.express)
  trace.spanRecorder.recordApi(ExpressMethodDescritpor.HANDLE)

  t.equal(traceContext.currentTraceObject().span.serviceType, ServiceTypeCode.express)
})

test('Should begin/end trace block asynchronously', async function (t) {
  t.plan(4)

  // start trace and write span info
  const traceContext = TraceContext.init(fixture.getAgentInfo())
  const startedTrace = traceContext.newTraceObject()
  const spanRecorder = startedTrace.spanRecorder
  spanRecorder.recordServiceType(ServiceTypeCode.express)

  const currentTrace = traceContext.currentTraceObject()
  const spanEventRecorder = currentTrace.traceBlockBegin()
  spanEventRecorder.recordServiceType(ServiceTypeCode.express)
  spanEventRecorder.recordApi(ExpressMethodDescritpor.HANDLE)

  t.equal(traceContext.currentTraceObject().callStack.length, 1)

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      const anotherContext = traceContext.currentTraceObject()
      t.equal(anotherContext.traceId, currentTrace.traceId)

      const spanEventRecorder2 = anotherContext.traceBlockBegin()
      t.equal(traceContext.currentTraceObject().callStack.length, 2)

      anotherContext.traceBlockEnd(spanEventRecorder2)
      resolve()
    }, 300)
  })

  currentTrace.traceBlockEnd(spanEventRecorder)
  t.equal(traceContext.currentTraceObject().callStack.length, 0)
})

test('Should complete trace ', async function (t) {
  t.plan(1)

  const transactionId = fixture.getTransactionId()
  const traceId = fixture.getTraceId(transactionId)
  const traceContext = TraceContext.init(fixture.getAgentInfo())

  traceContext.newTraceObject(traceId)

  await util.sleep(501)

  const trace = traceContext.completeTraceObject()
  t.ok(trace.spanRecorder.span.elapsedTime > 500)
})
