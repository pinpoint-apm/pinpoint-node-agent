const test = require('tape')

const Span = require('context/span')
const SpanRecorder = require('context/span-recorder')
const fixture = require('../fixture')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const ServiceTypeProperty = require('constant/service-type').ServiceTypeProperty

test('Should start ...', function (t) {
  t.plan(1)

  const span = new Span(fixture.getTraceId())
  const spanRecorder = new SpanRecorder(span)
  spanRecorder.recordServiceType(ServiceTypeCode.express, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)
  spanRecorder.recordApi('express.get')
  spanRecorder.recordRpc('/test/url')

  console.log('spanRecorder.span : ', spanRecorder.span)

  t.ok(spanRecorder.span)
})
