/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const Span = require('../../lib/context/span')
const SpanRecorder = require('../../lib/context/span-recorder')

const ServiceTypeCode = require('../../lib/constant/service-type').ServiceTypeCode
const ServiceTypeProperty = require('../../lib/constant/service-type').ServiceTypeProperty
const GeneralMethodDescriptor = require('../../lib/constant/method-descriptor').GeneralMethodDescriptor

test('Should create span recorder', async function (t) {
  t.plan(2)

  const span = new Span(fixture.getTraceId(), fixture.getAgentInfo())
  const spanRecorder = new SpanRecorder(span)
  spanRecorder.recordServiceType(ServiceTypeCode.express, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)
  spanRecorder.recordApi(GeneralMethodDescriptor.SERVER_REQUEST)
  spanRecorder.recordRpc('/test/url')
  t.ok(spanRecorder.span)

  spanRecorder.span.startTime = Date.now()
  await util.sleep(101)
  spanRecorder.span.markElapsedTime()
  t.ok(spanRecorder.span.elapsed > 100)
})
