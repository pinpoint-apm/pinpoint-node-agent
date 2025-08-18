/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const Span = require('../../lib/context/span')
const SpanEvent = require('../../lib/context/span-event')
const SpanEventRecorder = require('../../lib/context/span-event-recorder')
const ServiceType = require('../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const fixture = require('../fixture')

test('Should create span event recorder', async function (t) {
  t.plan(2)

  const span = new Span(fixture.getTraceId(), fixture.getAgentInfo())
  const spanEvent = new SpanEvent(span.spanId, 0)
  const spanEventRecorder = new SpanEventRecorder(spanEvent, span)
  spanEventRecorder.recordServiceType(ServiceType.express)
  spanEventRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
  t.ok(spanEventRecorder.spanEvent)

  spanEventRecorder.spanEvent.startTime = Date.now()

  await new Promise(resolve => setTimeout(resolve, 100))

  spanEventRecorder.spanEvent.markElapsedTime()
  t.ok(spanEventRecorder.spanEvent.endElapsed > 0)
})