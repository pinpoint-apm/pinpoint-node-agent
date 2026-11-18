/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const agent = require('../support/agent-singleton-mock')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const { AsyncLocalStorage } = require('node:async_hooks')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const GrpcDataSenderBuilder = require('./grpc-data-sender-builder')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const { startRequestStoreProbe } = require('../support/request-store-probe')

test('Should send agent info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const agentInfo = AgentInfo.make(agent.config)
  agent.dataSender.send(agentInfo)

  t.ok(true)
})

test('Should send api meta info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
  agent.dataSender.send(apiMetaInfo)

  t.equal(agent.dataSender.mockAPIMetaInfos[0], apiMetaInfo, "span is equal in datasender")
})

test('Should send string meta info', function (t) {
  t.plan(1)
  agent.bindHttp()

  const stringMetaInfo = StringMetaInfo.create('1', 'test string')
  agent.dataSender.send(stringMetaInfo)

  t.deepEqual(agent.dataSender.mockMetaInfo, stringMetaInfo, "agentInfo is equal in datasender")
})

test('A span sent inside a request store reaches the collector without the gRPC resources taking that store', async function (t) {
  let resolveSpan
  const spanReceived = new Promise(resolve => {
    resolveSpan = resolve
  })
  const collectorServer = new grpc.Server()
  collectorServer.addService(services.SpanService, {
    sendSpan: (call) => {
      call.on('data', (spanMessage) => {
        if (spanMessage.getSpan()) {
          resolveSpan()
        }
      })
    }
  })
  const port = await new Promise((resolve, reject) => {
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port))
  })
  agent.bindHttp(new GrpcDataSenderBuilder(port).enableSpan().build())
  const probe = startRequestStoreProbe()
  t.teardown(() => {
    probe.stop()
    agent.dataSender.close()
    collectorServer.forceShutdown()
  })

  const trace = agent.getTraceContext().newTraceObject('/')
  localStorage.run(trace, () => {
    agent.completeTraceObject(trace)
  })

  await spanReceived
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the request store')
  t.end()
})

test('An ApiMetaInfo sent inside a request store reaches the collector without the gRPC resources taking that store', async function (t) {
  let resolveApiMetaData
  const apiMetaDataReceived = new Promise(resolve => {
    resolveApiMetaData = resolve
  })
  const collectorServer = new grpc.Server()
  collectorServer.addService(services.MetadataService, {
    requestApiMetaData: (call, callback) => {
      callback(null, new spanMessages.PResult())
      resolveApiMetaData()
    }
  })
  const port = await new Promise((resolve, reject) => {
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port))
  })
  agent.bindHttp(new GrpcDataSenderBuilder(port).enableApiMetaInfo().build())
  const probe = startRequestStoreProbe()
  t.teardown(() => {
    probe.stop()
    agent.dataSender.close()
    collectorServer.forceShutdown()
  })

  const trace = agent.getTraceContext().newTraceObject('/')
  const methodDescriptor = defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor
  localStorage.run(trace, () => {
    agent.dataSender.send(ApiMetaInfo.create(methodDescriptor))
  })

  await apiMetaDataReceived
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the request store')
  t.end()
})

test('A span sent inside the store of another AsyncLocalStorage reaches the collector without the gRPC resources taking that store', async function (t) {
  let resolveSpan
  const spanReceived = new Promise(resolve => {
    resolveSpan = resolve
  })
  const collectorServer = new grpc.Server()
  collectorServer.addService(services.SpanService, {
    sendSpan: (call) => {
      call.on('data', (spanMessage) => {
        if (spanMessage.getSpan()) {
          resolveSpan()
        }
      })
    }
  })
  const port = await new Promise((resolve, reject) => {
    collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => error ? reject(error) : resolve(port))
  })
  agent.bindHttp(new GrpcDataSenderBuilder(port).enableSpan().build())
  const otherStorage = new AsyncLocalStorage()
  const probe = startRequestStoreProbe(otherStorage)
  t.teardown(() => {
    probe.stop()
    agent.dataSender.close()
    collectorServer.forceShutdown()
  })

  const trace = agent.getTraceContext().newTraceObject('/')
  otherStorage.run({ request: 'framework request' }, () => {
    agent.completeTraceObject(trace)
  })

  await spanReceived
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the store of the other AsyncLocalStorage')
  t.end()
})
