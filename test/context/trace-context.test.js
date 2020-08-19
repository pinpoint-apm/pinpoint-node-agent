/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const ServiceTypeCode = require('../../lib/constant/service-type').ServiceTypeCode
const TraceContext = require('../../lib/context/trace-context')
const GeneralMethodDescriptor = require('../../lib/constant/method-descriptor').GeneralMethodDescriptor
const dataSenderMock = require('../support/data-sender-mock')
const RequestHeaderUtils = require('../../lib/instrumentation/request-header-utils')

test('Should create continued trace and add span info', function (t) {
  t.plan(2)

  const transactionId = fixture.getTransactionId()
  const traceId = fixture.getTraceId(transactionId)
  const traceContext = TraceContext.init(fixture.getAgentInfo(), dataSenderMock())

  const trace = traceContext.continueTraceObject(traceId)

  t.equal(traceContext.currentTraceObject().traceId.transactionId.toString(), transactionId.toString())

  trace.spanRecorder.recordServiceType(ServiceTypeCode.express)
  trace.spanRecorder.recordApi(GeneralMethodDescriptor.SERVER_REQUEST)

  t.equal(traceContext.currentTraceObject().span.serviceType, ServiceTypeCode.express)
  traceContext.completeTraceObject(trace)
})

test('Should begin/end trace block asynchronously', async function (t) {
  t.plan(4)

  // start trace and write span info
  const traceContext = TraceContext.init(fixture.getAgentInfo(), dataSenderMock())
  const startedTrace = traceContext.newTraceObject(true)
  const spanRecorder = startedTrace.spanRecorder
  spanRecorder.recordServiceType(ServiceTypeCode.express)

  const currentTrace = traceContext.currentTraceObject()
  const spanEventRecorder = currentTrace.traceBlockBegin()
  spanEventRecorder.recordServiceType(ServiceTypeCode.express)
  spanEventRecorder.recordApi(GeneralMethodDescriptor.SERVER_REQUEST)

  t.equal(traceContext.currentTraceObject().callStack.length, 1)

  const anotherContext = traceContext.currentTraceObject()
  t.equal(anotherContext.traceId, currentTrace.traceId)

  const spanEventRecorder2 = anotherContext.traceBlockBegin()
  t.equal(traceContext.currentTraceObject().callStack.length, 2)

  anotherContext.traceBlockEnd(spanEventRecorder2)

  currentTrace.traceBlockEnd(spanEventRecorder)
  t.equal(traceContext.currentTraceObject().callStack.length, 0, "traceBolckEnd callstack length is zero")
})

test('Should complete trace ', async function (t) {
  t.plan(1)

  const transactionId = fixture.getTransactionId()
  const traceId = fixture.getTraceId(transactionId)
  const traceContext = TraceContext.init(fixture.getAgentInfo(), dataSenderMock())

  const trace = traceContext.newTraceObject(traceId)

  await util.sleep(501)

  traceContext.completeTraceObject(trace)
  t.ok(trace.spanRecorder.span.elapsedTime > 500)
})

test('new Trace', (t) => {
  t.plan(4)

  const dut = TraceContext.init(fixture.getAgentInfo(), dataSenderMock(), fixture.config)
  t.true( dut.isSampling != null, 'dut is not null')

  const req = {
    url: "http://test.com",
    headers: {
    },
    connection: {}
  }
  const requestData = RequestHeaderUtils.read(req)

  t.equal(requestData.isRoot, true, 'root request')

  const trace = dut.makeTrace(requestData)
  t.equal(trace.traceId.parentSpanId, -1, 'trace is not null')
  t.true(trace.traceId.spanId > 0, 'trace id')
})
