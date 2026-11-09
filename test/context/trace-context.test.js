/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const ServiceType = require('../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const TraceIdBuilder = require('../../lib/context/trace/trace-id-builder')
const { ProcessAgentBuilder } = require('../support/process-agent-builder')
const { dataSenderNullObject } = require('../support/data-sender-null-object')
const RecordingDataSender = require('../support/recording-data-sender')

test('Should create continued trace and add span info', function (t) {
  t.plan(2)
  const agent = new ProcessAgentBuilder().setDataSender(dataSenderNullObject).build()
  const traceContext = agent.getTraceContext()
  const traceId = new TraceIdBuilder(agent.getConfig().getAgentId(), agent.agentStartTime, '9').build()
  const trace = traceContext.continueTraceObject(traceId)
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
  const agent = new ProcessAgentBuilder().setDataSender(dataSenderNullObject).build()
  const traceContext = agent.getTraceContext()
  const startedTrace = traceContext.newTraceObject('/')

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
    traceContext.completeTraceObject(startedTrace)
  })
})

test('Should complete trace ', async function (t) {
  t.plan(2)
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const traceContext = agent.getTraceContext()
  const trace = traceContext.newTraceObject('/')

  await new Promise(resolve => setTimeout(resolve, 501))

  traceContext.completeTraceObject(trace)
  const span = dataSender.findSpan(trace.getTraceRoot())
  t.ok(span, 'the completed trace sends its span')
  t.ok(span.elapsedTime >= 500, 'the sent span has the elapsed time of the 501ms wait')
})
