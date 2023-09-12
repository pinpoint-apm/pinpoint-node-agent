/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const Span = require('../../lib/context/span')
const SpanRecorder = require('../../lib/context/span-recorder')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../lib/context/service-type')
const ServiceTypeProperty = require('../../lib/constant/service-type').ServiceTypeProperty

test('Should create span recorder', async function (t) {
  const span = new Span(fixture.getTraceId(), fixture.getAgentInfo())
  const spanRecorder = new SpanRecorder(span)
  spanRecorder.recordServiceType(ServiceType.express, ServiceTypeProperty.TERMINAL, ServiceTypeProperty.RECORD_STATISTICS)
  spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
  spanRecorder.recordRpc('/test/url')
  t.ok(spanRecorder.span)

  spanRecorder.span.startTime = Date.now()
  await util.sleep(101)
  spanRecorder.span.markElapsedTime()
  t.ok(spanRecorder.span.elapsed > 0, 'markElapsedTime')
  t.end()
})
