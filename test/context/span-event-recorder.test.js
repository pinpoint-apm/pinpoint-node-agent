/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const {
  log,
  fixture,
  util
} = require('../test-helper')

const Span = require('../../lib/context/span')
const SpanEvent = require('../../lib/context/span-event')
const SpanEventRecorder = require('../../lib/context/span-event-recorder')
const ServiceType = require('../../lib/context/service-type')
const agent = require('../support/agent-singleton-mock')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')

test('Should create span event recorder', async function (t) {
  t.plan(2)

  const span = new Span(fixture.getTraceId(), fixture.getAgentInfo())
  const spanEvent = new SpanEvent(span.spanId, 0)
  const spanEventRecorder = new SpanEventRecorder(spanEvent, span)
  spanEventRecorder.recordServiceType(ServiceType.express)
  spanEventRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
  t.ok(spanEventRecorder.spanEvent)

  spanEventRecorder.spanEvent.startTime = Date.now()
  await util.sleep(101)
  spanEventRecorder.spanEvent.markElapsedTime()
  t.ok(spanEventRecorder.spanEvent.endElapsed > 0)
})

test.skip(`spanevent with async_hooks`, async function (t) {
  agent.bindHttp()

  t.plan(5)

  const trace = agent.createTraceObject()
  trace.startSpanEvent(new SpanEventRecorder.builder()
    .setServiceType(ServiceType.redis)
    .setApiDesc('redis.get.call')
    .setDestinationId('destinationId')
    .setEndPointIP('127.0.0.1')
    .setEndPointPort(9334))

  t.true(trace.callStack.length == 1, `spanEvent call stack is one`)
  t.equal(trace.spanEventRecorder.spanEvent.serviceType, ServiceTypeCode.redis, "redis")
  t.equal(trace.spanEventRecorder.spanEvent.annotations[0].value.stringValue, 'redis.get.call', 'redis call')
  t.equal(trace.spanEventRecorder.spanEvent.destinationId, 'destinationId', 'destinationId')
  t.equal(trace.spanEventRecorder.spanEvent.endPoint, '127.0.0.1:9334', 'endpoint')
})