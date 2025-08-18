/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const ServiceType = require('../../lib/context/service-type')
const TraceContext = require('../../lib/context/trace-context')
const dataSenderMock = require('../support/data-sender-mock')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const agent = require('../support/agent-singleton-mock')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')

test('Should create continued trace and add span info', function (t) {
  t.plan(2)

  const traceContext = new TraceContext(agent.agentInfo, dataSenderMock(), agent.config)
  const traceId = new TraceIdBuilder(agent.agentInfo.getAgentId(), agent.agentInfo.getAgentStartTime(), '9').build()
  const trace = traceContext.continueTraceObject2(traceId)
  localStorage.run(trace, () => {
    t.equal(traceContext.currentTraceObject().getTraceId(), traceId, `traceId is ${traceId}`)

    trace.spanRecorder.recordServiceType(ServiceType.express)
    trace.spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)

    t.equal(traceContext.currentTraceObject().spanBuilder.serviceType, ServiceType.express.getCode())
    traceContext.completeTraceObject(trace)
  })
})

test('Should begin/end trace block asynchronously', async function (t) {
  t.plan(4)

  // start trace and write span info
  const traceContext = new TraceContext(agent.agentInfo, dataSenderMock(), agent.config)
  const startedTrace = traceContext.newTraceObject2('/')

  localStorage.run(startedTrace, () => {
    const spanRecorder = startedTrace.spanRecorder
    spanRecorder.recordServiceType(ServiceType.express)

    const currentTrace = traceContext.currentTraceObject()
    const spanEventRecorder = currentTrace.traceBlockBegin()
    spanEventRecorder.recordServiceType(ServiceType.express)
    spanEventRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)

    t.equal(traceContext.currentTraceObject().callStack.stack.length, 1)

    const anotherContext = traceContext.currentTraceObject()
    t.equal(anotherContext.traceId, currentTrace.traceId)

    const spanEventRecorder2 = anotherContext.traceBlockBegin()
    t.equal(traceContext.currentTraceObject().callStack.stack.length, 2)

    anotherContext.traceBlockEnd(spanEventRecorder2)

    currentTrace.traceBlockEnd(spanEventRecorder)
    t.equal(traceContext.currentTraceObject().callStack.stack.length, 0, "traceBolckEnd callstack length is zero")
  })
})

test('Should complete trace ', async function (t) {
  t.plan(1)
  const traceContext = new TraceContext(agent.agentInfo, dataSenderMock(), agent.config)
  const trace = traceContext.newTraceObject2('/')

  await new Promise(resolve => setTimeout(resolve, 501))

  traceContext.completeTraceObject(trace)
  t.ok(trace.spanRecorder.spanBuilder.elapsedTime > 0)
})
