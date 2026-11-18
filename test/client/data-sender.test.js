/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { AsyncLocalStorage } = require('node:async_hooks')

const { ProcessAgentBuilder } = require('../support/process-agent-builder')
const RecordingDataSender = require('../support/recording-data-sender')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const { TestGrpcDataSenderBuilder, SpanAdaptor, MetadataAdaptor } = require('../support/test-grpc-data-sender')
const { startRequestStoreProbe } = require('../support/request-store-probe')

test('Should send api meta info', function (t) {
  t.plan(1)
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  agent.dataSender.send(apiMetaInfo)

  t.equal(dataSender.apiMetaInfos()[0], apiMetaInfo, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  agent.dataSender.send(stringMetaInfo)

  t.deepEqual(dataSender.stringMetaInfos().at(-1), stringMetaInfo, "agentInfo is equal in datasender")
})

test('A span sent inside a request store reaches the collector without the gRPC resources taking that store', async function (t) {
  const spanAdaptor = new SpanAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(spanAdaptor)
    .build()
  const probe = startRequestStoreProbe()
  t.teardown(() => {
    probe.stop()
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  const trace = agent.getTraceContext().newTraceObject('/')
  localStorage.run(trace, () => {
    agent.completeTraceObject(trace)
  })

  await spanAdaptor.span(trace.getTraceRoot())
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the request store')
  t.end()
})

test('An ApiMetaInfo sent inside a request store reaches the collector without the gRPC resources taking that store', async function (t) {
  const metadataAdaptor = new MetadataAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(metadataAdaptor)
    .build()
  const probe = startRequestStoreProbe()
  t.teardown(() => {
    probe.stop()
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  const trace = agent.getTraceContext().newTraceObject('/')
  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  localStorage.run(trace, () => {
    agent.dataSender.send(ApiMetaInfo.create(methodDescriptor))
  })

  await metadataAdaptor.apiMetaData(methodDescriptor.getApiId())
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the request store')
  t.end()
})

test('A span sent inside the store of another AsyncLocalStorage reaches the collector without the gRPC resources taking that store', async function (t) {
  const spanAdaptor = new SpanAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(spanAdaptor)
    .build()
  const otherStorage = new AsyncLocalStorage()
  const probe = startRequestStoreProbe(otherStorage)
  t.teardown(() => {
    probe.stop()
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  const trace = agent.getTraceContext().newTraceObject('/')
  otherStorage.run({ request: 'framework request' }, () => {
    agent.completeTraceObject(trace)
  })

  await spanAdaptor.span(trace.getTraceRoot())
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the store of the other AsyncLocalStorage')
  t.end()
})
