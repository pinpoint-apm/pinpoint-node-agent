const test = require('tape')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const TraceContext = require('context/trace-context')
const fixture = require('../fixture')

const agentInfo = {
  agentId: fixture.config.agentId,
  agentStartTime: Date.now()
}

test('Should create continued trace and add span info', function (t) {
  t.plan(2)

  const transactionId = fixture.getTransactionId()
  const traceId = fixture.getTraceId(transactionId)
  const traceContext = TraceContext.init(agentInfo)

  const trace = traceContext.continueTraceObject(traceId)

  t.equal(traceContext.currentTraceObject().traceId.transactionId.toString(), transactionId.toString())

  trace.spanRecorder.recordServiceType(ServiceTypeCode.express)
  trace.spanRecorder.recordApiId('express.get')

  t.equal(traceContext.currentTraceObject().spanRecorder.span.serviceType.code, ServiceTypeCode.express)
})

test('Should get current trace and begin trace block', function (t) {
  t.plan(2)

  // start trace and write span info
  const traceContext = TraceContext.init(agentInfo)
  const startedTrace = traceContext.newTraceObject()
  const spanRecorder = startedTrace.spanRecorder
  spanRecorder.recordServiceType(ServiceTypeCode.express)

  const currentTrace = traceContext.currentTraceObject()
  const spanEventRecorder = currentTrace.traceBlockBegin()
  spanEventRecorder.recordServiceType(ServiceTypeCode.express)
  spanEventRecorder.recordApiId('express.get')

  t.equal(traceContext.currentTraceObject().callStack.length, 1)

  setTimeout(() => {
    currentTrace.traceBlockEnd()
    t.equal(currentTrace.callStack.length, 0)
  }, 500)
})

