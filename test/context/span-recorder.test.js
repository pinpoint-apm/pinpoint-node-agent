const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const Span = require('context/span')
const SpanRecorder = require('context/span-recorder')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const ServiceTypeProperty = require('constant/service-type').ServiceTypeProperty
const ExpressMethodDescritpor = require('constant/method-descriptor').ExpressMethodDescritpor

test('Should start ...', async function (t) {
  t.plan(2)

  const span = new Span(fixture.getTraceId(), fixture.getAgentInfo())
  const spanRecorder = new SpanRecorder(span)
  spanRecorder.recordServiceType(ServiceTypeCode.express, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)
  spanRecorder.recordApi(ExpressMethodDescritpor.HANDLE)
  spanRecorder.recordRpc('/test/url')
  t.ok(spanRecorder.span)

  spanRecorder.span.startTime = Date.now()
  await util.sleep(101)
  spanRecorder.span.markElapsedTime()
  t.ok(spanRecorder.span.elapsed > 100)
})
