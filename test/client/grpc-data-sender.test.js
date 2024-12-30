/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const AsyncId = require('../../lib/context/async-id')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { beforeSpecificOne, afterOne, getCallRequests, getMetadata, DataSourceCallCountable } = require('./grpc-fixture')
const cmdMessage = require('../../lib/data/v1/Cmd_pb')
const CommandType = require('../../lib/client/command/command-type')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const CallArgumentsBuilder = require('../../lib/client/call-arguments-builder')
const agent = require('../support/agent-singleton-mock')
const RemoteTraceRootBuilder = require('../../lib/context/remote-trace-root-builder')
const SpanBuilder = require('../../lib/context/span-builder')
const AsyncSpanChunkBuilder = require('../../lib/context/trace/async-span-chunk-builder')
const SpanRepository = require('../../lib/context/trace/span-repository')
const ChildTraceBuilder = require('../../lib/context/trace/child-trace-builder')
const serviceType = require('../../lib/context/service-type')
const SpanChunkBuilder = require('../../lib/context/span-chunk-builder')
const Trace = require('../../lib/context/trace/trace2')
const defaultPredefinedMethodDescriptorRegistry = require('../../lib/constant/default-predefined-method-descriptor-registry')
const dataSenderMock = require('../support/data-sender-mock')

let sendSpanMethodOnDataCallback
function sendSpan(call) {
  call.on('error', function (error) {
    console.log(`error ${error}`)
  })
  call.on('data', function (spanMessage) {
    let spanOrChunk = spanMessage.getSpan()
    if (!spanOrChunk) {
      spanOrChunk = spanMessage.getSpanchunk()
    }
    const callRequests = getCallRequests()
    callRequests.push(spanOrChunk)
    sendSpanMethodOnDataCallback?.(spanOrChunk)
  })
  call.on('end', function () {
  })
  const callMetadata = getMetadata()
  callMetadata.push(call.metadata)
}

class DataSource extends DataSourceCallCountable {
  constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
    super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
  }

  initializeClients() { }
  initializeMetadataClients() { }
  initializeStatStream() { }
  initializePingStream() { }
  initializeAgentInfoScheduler() { }
  initializeProfilerClients() { }
}

test('Should send span', function (t) {
  agent.bindHttp()
  sendSpanMethodOnDataCallback = null

  const server = new grpc.Server()
  server.addService(services.SpanService, {
    sendSpan: sendSpan
  })
  let dataSender
  server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, DataSource)
    const traceRoot = new RemoteTraceRootBuilder(agent.agentInfo, '5').build()
    dataSender = dataSenderMock(agent.config, grpcDataSender)
    const spanBuilder = new SpanBuilder(traceRoot)
    spanBuilder.setServiceType(1400)
    spanBuilder.setEndPoint('localhost:3000')
    spanBuilder.setRemoteAddress('::1')
    spanBuilder.markAfterTime()
    spanBuilder.setApiId(1)
    spanBuilder.setRpc('/')
    spanBuilder.setApplicationServiceType(1400)
    traceRoot.getShared().maskErrorCode(1)
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
    const repository = new SpanRepository(spanChunkBuilder, dataSender, agent.agentInfo)
    const trace = new Trace(spanBuilder, repository)

    const spanEventRecorder = trace.traceBlockBegin()
    spanEventRecorder.spanEventBuilder.setSequence(10)
    spanEventRecorder.spanEventBuilder.setDepth(1)
    spanEventRecorder.recordApiDesc('http.request')
    spanEventRecorder.spanEventBuilder.startTime = spanBuilder.startTime + 72
    spanEventRecorder.recordServiceType(serviceType.asyncHttpClientInternal)

    setTimeout(() => {
      trace.traceBlockEnd(spanEventRecorder)
      agent.completeTraceObject(trace)
    }, 1000)

    sendSpanMethodOnDataCallback = (actual) => {
      t.true(actual != null, 'spanChunk send')
      t.equal(actual.getVersion(), 1, `spanChunk version is ${actual.getVersion()}`)

      const actualTransactionId = actual.getTransactionid()
      t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), `agentId ${traceRoot.getAgentId()}`)
      t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), 'agent start time')
      t.equal(actualTransactionId.getSequence(), traceRoot.getTransactionId(), `sequence ${traceRoot.getTransactionId()}`)
      t.equal(actual.getSpanid(), traceRoot.getTraceId().getSpanId(), 'span ID')
      t.equal(actual.getParentspanid(), traceRoot.getTraceId().getParentSpanId(), 'parent span ID')

      t.equal(actual.getStarttime(), spanBuilder.startTime, 'startTimeStamp')
      t.equal(actual.getElapsed(), spanBuilder.elapsedTime, 'elapsed time')
      t.equal(actual.getApiid(), 1, 'api ID')

      t.equal(actual.getServicetype(), 1400, 'service type')

      const actualAcceptEvent = actual.getAcceptevent()
      t.equal(actualAcceptEvent.getRpc(), '/', 'rpc')
      t.equal(actualAcceptEvent.getEndpoint(), 'localhost:3000', 'endPoint')
      t.equal(actualAcceptEvent.getRemoteaddr(), '::1', 'remoteAddr')

      t.equal(actual.getFlag(), 0, 'flag')
      t.equal(actual.getErr(), 1, 'Error')

      const actualSpanEvents = actual.getSpaneventList()
      actualSpanEvents.forEach(pSpanEvent => {
        t.equal(pSpanEvent.getSequence(), 10, 'sequence')
        t.equal(pSpanEvent.getDepth(), 1, 'depth')

        t.equal(pSpanEvent.getStartelapsed(), 72, 'startElapsed')
        t.equal(pSpanEvent.getEndelapsed(), dataSender.mockSpan.spanEventList[0].elapsedTime, 'endElapsed')

        t.equal(pSpanEvent.getServicetype(), 9057, 'serviceType')

        const pAnnotations = pSpanEvent.getAnnotationList()
        pAnnotations.forEach(annotation => {
          t.equal(annotation.getKey(), 12, 'annotation key')
          const pAnnotationValue = annotation.getValue()
          t.equal(pAnnotationValue.getStringvalue(), 'http.request', 'annotation string value')
        })
      })

      t.equal(actual.getApiid(), 1, 'API ID')
      t.equal(actual.getExceptioninfo(), undefined, 'span exceptionInfo')

      t.equal(actual.getApplicationservicetype(), 1400, 'applicaiton service type')
      t.equal(actual.getLoggingtransactioninfo(), 0, 'logging transaction info')

      afterOne(t)
    }
  })
  t.teardown(() => {
    dataSender.close()
    server.forceShutdown()
  })
})

test('sendSpanChunk redis.SET.end', function (t) {
  agent.bindHttp()
  sendSpanMethodOnDataCallback = null
  const server = new grpc.Server()
  server.addService(services.SpanService, {
    sendSpan: sendSpan
  })

  let dataSender
  server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, DataSource)
    const traceRoot = new RemoteTraceRootBuilder(agent.agentInfo, '5').build()
    const asyncId = AsyncId.make()
    dataSender = dataSenderMock(agent.config, grpcDataSender)
    const spanChunkBuilder = new AsyncSpanChunkBuilder(traceRoot, asyncId)
    const repository = new SpanRepository(spanChunkBuilder, dataSender, agent.agentInfo)
    const childTraceBuilder = new ChildTraceBuilder(traceRoot, repository, asyncId)

    const spanEventRecorder = childTraceBuilder.traceBlockBegin()
    spanEventRecorder.recordServiceType(serviceType.redis)
    spanEventRecorder.recordApiDesc('redis.SET.end')
    childTraceBuilder.traceBlockEnd(spanEventRecorder)

    agent.completeTraceObject(childTraceBuilder)

    sendSpanMethodOnDataCallback = (actualSpanChunk) => {
      t.plan(22)
      t.true(actualSpanChunk != null, 'spanChunk send')
      t.equal(actualSpanChunk.getVersion(), 1, 'spanChunk version is 1')

      const actualTransactionId = actualSpanChunk.getTransactionid()
      t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), 'gRPC agentId')
      t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), 'agent start time')
      t.equal(actualTransactionId.getSequence(), traceRoot.getTransactionId(), 'sequence')

      t.equal(actualSpanChunk.getSpanid(), traceRoot.getTraceId().getSpanId(), 'span ID')
      t.equal(actualSpanChunk.getEndpoint(), '', 'endpoint')
      t.equal(actualSpanChunk.getApplicationservicetype(), actualSpanChunk.getApplicationservicetype(), 'application service type')

      const actualLocalAsyncId = actualSpanChunk.getLocalasyncid()
      t.equal(actualLocalAsyncId.getAsyncid(), asyncId.getAsyncId(), 'local async id')
      t.equal(actualLocalAsyncId.getSequence(), asyncId.getSequence(), 'local async id sequence')

      t.equal(actualSpanChunk.getKeytime(), spanChunkBuilder.keyTime, 'keytime')
      const actualSpanEvents = actualSpanChunk.getSpaneventList()
      actualSpanEvents.forEach((pSpanEvent, index) => {
        if (index == 0) {
          t.equal(pSpanEvent.getSequence(), 0, 'sequence')
          t.equal(pSpanEvent.getDepth(), 1, 'depth')
          t.equal(pSpanEvent.getServicetype(), 100, 'serviceType')
          t.equal(pSpanEvent.getStartelapsed(), 0, 'startElapsed')
        } else if (index == 1) {
          t.equal(pSpanEvent.getSequence(), 1, 'sequence')
          t.equal(pSpanEvent.getDepth(), 2, 'depth')

          const expectedSpanChunk = repository.dataSender.findSpanChunk(childTraceBuilder.localAsyncId)
          const expectedSpanEvent = expectedSpanChunk.spanEventList[1]
          t.equal(pSpanEvent.getStartelapsed(), expectedSpanEvent.startElapsedTime, `pSpanEvent.getStartelapsed() : ${pSpanEvent.getStartelapsed()}, expectedSpanEvent.startElapsedTime : ${expectedSpanEvent.startElapsedTime}`)
          t.equal(pSpanEvent.getEndelapsed(), expectedSpanEvent.elapsedTime, `pSpanEvent.getEndelapsed() : ${pSpanEvent.getEndelapsed()}, expectedSpanEvent.elapsedTime : ${expectedSpanEvent.elapsedTime}`)
          t.equal(pSpanEvent.getServicetype(), 8200, 'serviceType')

          const pAnnotations = pSpanEvent.getAnnotationList()
          pAnnotations.forEach(annotation => {
            t.equal(annotation.getKey(), 12, 'annotation key')
            const pAnnotationValue = annotation.getValue()
            t.equal(pAnnotationValue.getStringvalue(), 'redis.SET.end', 'annotation string value')
          })
        }
      })
      afterOne(t)
    }
  })
  t.teardown(() => {
    dataSender.close()
    server.forceShutdown()
  })
})

test('sendSpanChunk redis.GET.end', (t) => {
  agent.bindHttp()
  sendSpanMethodOnDataCallback = null
  const server = new grpc.Server()
  server.addService(services.SpanService, {
    sendSpan: sendSpan
  })

  let dataSender
  server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, DataSource)
    const traceRoot = new RemoteTraceRootBuilder(agent.agentInfo, '5').build()
    const asyncId = AsyncId.make()
    dataSender = dataSenderMock(agent.config, grpcDataSender)
    const spanChunkBuilder = new AsyncSpanChunkBuilder(traceRoot, asyncId)
    const repository = new SpanRepository(spanChunkBuilder, dataSender, agent.agentInfo)
    const childTraceBuilder = new ChildTraceBuilder(traceRoot, repository, asyncId)

    const spanEventRecorder = childTraceBuilder.traceBlockBegin()
    spanEventRecorder.recordServiceType(serviceType.redis)
    spanEventRecorder.recordApiDesc('redis.GET.end')
    childTraceBuilder.traceBlockEnd(spanEventRecorder)

    agent.completeTraceObject(childTraceBuilder)

    sendSpanMethodOnDataCallback = (actualSpanChunk) => {
      t.plan(16)
      t.equal(actualSpanChunk.getVersion(), 1, 'version')

      const actualTransactionId = actualSpanChunk.getTransactionid()
      t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), 'gRPC agentId')
      t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), 'agent start time')
      t.equal(actualTransactionId.getSequence(), traceRoot.getTransactionId(), 'sequence')

      t.equal(actualSpanChunk.getSpanid(), traceRoot.getTraceId().getSpanId(), 'span ID')
      t.equal(actualSpanChunk.getEndpoint(), '', 'endpoint')
      t.equal(actualSpanChunk.getApplicationservicetype(), actualSpanChunk.getApplicationservicetype(), 'application service type')

      const actualLocalAsyncId = actualSpanChunk.getLocalasyncid()
      t.equal(actualLocalAsyncId.getAsyncid(), asyncId.getAsyncId(), 'local async id')
      t.equal(actualLocalAsyncId.getSequence(), asyncId.getSequence(), 'local async id sequence')

      t.equal(actualSpanChunk.getKeytime(), spanChunkBuilder.keyTime, `keytime ${actualSpanChunk.getKeytime()}`)
      const actualSpanEvents = actualSpanChunk.getSpaneventList()
      actualSpanEvents.forEach((pSpanEvent, index) => {
        if (index == 1) {
          t.equal(pSpanEvent.getSequence(), 1, 'sequence')
          t.equal(pSpanEvent.getDepth(), 2, 'depth')

          const expectedSpanChunk = repository.dataSender.findSpanChunk(childTraceBuilder.localAsyncId)
          const expectedSpanEvent = expectedSpanChunk.spanEventList[0]
          t.equal(pSpanEvent.getStartelapsed(), expectedSpanEvent.startElapsedTime, 'startElapsed')
          t.equal(pSpanEvent.getServicetype(), 8200, 'serviceType')

          const pAnnotations = pSpanEvent.getAnnotationList()
          pAnnotations.forEach(annotation => {
            t.equal(annotation.getKey(), 12, 'annotation key')
            const pAnnotationValue = annotation.getValue()
            t.equal(pAnnotationValue.getStringvalue(), 'redis.GET.end', 'annotation string value')
          })
        }
      })
      afterOne(t)
    }
  })
  t.teardown(() => {
    dataSender.close()
    server.forceShutdown()
  })
})

test('sendSpan', (t) => {
  agent.bindHttp()
  sendSpanMethodOnDataCallback = null
  const server = new grpc.Server()
  server.addService(services.SpanService, {
    sendSpan: sendSpan
  })

  let dataSender
  server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, DataSource)
    const traceRoot = new RemoteTraceRootBuilder(agent.agentInfo, '5').build()
    dataSender = dataSenderMock(agent.config, grpcDataSender)
    const spanBuilder = new SpanBuilder(traceRoot)
    const spanChunkBuilder = new SpanChunkBuilder(traceRoot)
    const repository = new SpanRepository(spanChunkBuilder, dataSender, agent.agentInfo)
    const trace = new Trace(spanBuilder, repository)
    trace.spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
    trace.spanRecorder.recordServiceType(serviceType.node)
    trace.spanRecorder.recordRpc('/')
    trace.spanRecorder.recordEndPoint('localhost:3000')
    trace.spanRecorder.recordRemoteAddress('::1')

    let spanEventRecorder = trace.traceBlockBegin()
    spanEventRecorder.spanEventBuilder.startTime = spanBuilder.startTime + 3
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    trace.traceBlockEnd(spanEventRecorder)

    spanEventRecorder = trace.traceBlockBegin()
    const asyncId = spanEventRecorder.getNextAsyncId()
    trace.traceBlockEnd(spanEventRecorder)

    agent.completeTraceObject(trace)

    sendSpanMethodOnDataCallback = (actualSpan) => {
      t.plan(22)
      t.equal(actualSpan.getVersion(), 1, 'version')

      const actualTransactionId = actualSpan.getTransactionid()
      t.equal(actualTransactionId.getAgentid(), traceRoot.getAgentId(), 'gRPC agentId')
      t.equal(actualTransactionId.getAgentstarttime(), traceRoot.getTraceId().getAgentStartTime(), 'agent start time')
      t.equal(actualTransactionId.getSequence(), traceRoot.getTransactionId(), 'sequence')

      t.equal(actualSpan.getSpanid(), traceRoot.getTraceId().getSpanId(), 'span ID')
      t.equal(actualSpan.getParentspanid(), traceRoot.getTraceId().getParentSpanId(), 'span.parentspanid')

      t.equal(actualSpan.getStarttime(), spanBuilder.startTime, 'span.startTime')
      t.equal(actualSpan.getElapsed(), spanBuilder.elapsedTime, 'span.elapsed')
      t.equal(actualSpan.getApiid(), 1, 'span.apiid')

      t.equal(actualSpan.getServicetype(), 1400, 'span.servicetype')

      const actualAcceptEvent = actualSpan.getAcceptevent()
      t.equal(actualAcceptEvent.getRpc(), '/', 'rpc')
      t.equal(actualAcceptEvent.getEndpoint(), 'localhost:3000', 'endPoint')
      t.equal(actualAcceptEvent.getRemoteaddr(), '::1', 'remoteAddr')

      t.equal(actualSpan.getFlag(), 0, 'flag')
      t.equal(actualSpan.getErr(), 0, 'Error')

      t.equal(actualSpan.getExceptioninfo(), undefined, 'span exceptionInfo')

      t.equal(actualSpan.getApplicationservicetype(), 1400, 'applicaiton service type')
      t.equal(actualSpan.getLoggingtransactioninfo(), 0, 'logging transaction info')

      const actualSpanEvents = actualSpan.getSpaneventList()
      actualSpanEvents.forEach((pSpanEvent, index) => {
        if (index == 0) {
          t.equal(pSpanEvent.getSequence(), 0, 'sort span events')
          t.equal(pSpanEvent.getDepth(), 1, 'depth')
          t.equal(pSpanEvent.getStartelapsed(), 3, 'startElapsed')
        }
        if (pSpanEvent.getSequence() == 6) {
          t.equal(pSpanEvent.getAsyncevent(), asyncId.getAsyncId(), 'async event')
        }
      })
      afterOne(t)
    }
  })
  t.teardown(() => {
    dataSender.close()
    server.forceShutdown()
  })
})

test.skip('sendStat', (t) => {
  let expectedStat = {
    'agentId': 'express-node-sample-id',
    'agentStartTime': 1593058531421,
    'timestamp': 1593058537472,
    'collectInterval': 1000,
    'memory': {
      'heapUsed': 37042600,
      'heapTotal': 62197760
    },
    'cpu': {
      'user': 0.0003919068831319893,
      'system': 0
    },
    'activeTrace': {
      'schema': {
        'typeCode': 2,
        'fast': 1000,
        'normal': 3000,
        'slow': 5000
      },
      'typeCode': 2,
      'fastCount': 0,
      'normalCount': 0,
      'slowCount': 0,
      'verySlowCount': 0
    }
  }
  grpcDataSender.sendStat(expectedStat)

  const pStatMessage = grpcDataSender.actualPStatMessage
  const pAgentStat = pStatMessage.getAgentstat()
  t.plan(4)

  t.equal(pAgentStat.getTimestamp(), 1593058537472, 'timestamp')
  t.equal(pAgentStat.getCollectinterval(), 1000, 'collectInterval')

  const pCpuLoad = pAgentStat.getCpuload()
  t.equal(pCpuLoad.getJvmcpuload(), 0.0003919068831319893, 'cpu.user')
  t.equal(pCpuLoad.getSystemcpuload(), 0, 'cpu.system')
})

let requestId = 0
const handleCommandV2Service = (call) => {
  const callRequests = getCallRequests()
  const callMetadata = getMetadata()
  callRequests.push(call.request)
  callMetadata.push(call.metadata)

  handleCommandCall = call

  requestId++
  serverCallWriter(CommandType.echo)
}

let handleCommandCall
const serverCallWriter = (commandType) => {
  const result = new cmdMessage.PCmdRequest()
  result.setRequestid(requestId)

  if (commandType === CommandType.activeThreadCount) {
    const commandActiveThreadCount = new cmdMessage.PCmdActiveThreadCount()
    result.setCommandactivethreadcount(commandActiveThreadCount)
  } else {
    const message = new cmdMessage.PCmdEcho()
    message.setMessage('echo')
    result.setCommandecho(message)
  }

  handleCommandCall.write(result)
}

let dataCallbackOnServerCall
const emptyResponseService = (call, callback) => {
  call.on('data', (data) => {
    if (typeof dataCallbackOnServerCall === 'function') {
      dataCallbackOnServerCall(data)
    }
  })

  const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt')
  const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts')
  const callRequests = getCallRequests()
  const callMetadata = getMetadata()
  // console.debug(`succeed-on-retry-attempt: ${succeedOnRetryAttempt[0]}, grpc-previous-rpc-attempts: ${previousAttempts[0]}`)
  if (succeedOnRetryAttempt.length === 0 || (previousAttempts.length > 0 && previousAttempts[0] === succeedOnRetryAttempt[0])) {
    callRequests.push(call.request)
    callMetadata.push(call.metadata)
    callback(null, new Empty())
  } else {
    const statusCode = call.metadata.get('respond-with-status')
    const code = statusCode[0] ? Number.parseInt(statusCode[0]) : grpc.status.UNKNOWN
    callback({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}` })
  }
}

class ProfilerDataSource extends DataSourceCallCountable {
  constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
    super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
  }

  initializeClients() { }
  initializeMetadataClients() { }
  initializeSpanStream() { }
  initializeStatStream() { }
  initializePingStream() { }
  initializeAgentInfoScheduler() { }
}

test('sendSupportedServicesCommand and commandEcho', (t) => {
  dataCallbackOnServerCall = null
  const server = new grpc.Server()
  server.addService(services.ProfilerCommandServiceService, {
    handleCommandV2: handleCommandV2Service,
    commandEcho: emptyResponseService
  })

  let dataSender
  server.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    dataSender = beforeSpecificOne(port, ProfilerDataSource)

    const callArguments = new CallArgumentsBuilder(function (error, response) {
      const callRequests = getCallRequests()
      const commonResponse = callRequests[1].getCommonresponse()
      t.equal(commonResponse.getResponseid(), requestId, 'response id matches request id')
      t.equal(commonResponse.getStatus(), 0, 'status is success')
      t.equal(commonResponse.getMessage().getValue(), '', 'message is empty')

      const cmdEchoResponse = callRequests[1]
      t.equal(cmdEchoResponse.getMessage(), 'echo', 'echo message')
      dataSender.commandStream.writableStream.on('close', () => {
        t.end()
      })
      dataSender.close()
      server.forceShutdown()
    }).build()
    dataSender.sendSupportedServicesCommand(callArguments)
  })
})

test('CommandStreamActiveThreadCount', (t) => {
  const server = new grpc.Server()
  server.addService(services.ProfilerCommandServiceService, {
    handleCommandV2: handleCommandV2Service,
    commandEcho: emptyResponseService,
    commandStreamActiveThreadCount: emptyResponseService
  })
  let dataSender
  server.bindAsync('127.0.0.1:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    dataSender = beforeSpecificOne(port, ProfilerDataSource)

    let callCount = 0
    dataCallbackOnServerCall = (data) => {
      ++callCount
      const commonStreamResponse = data.getCommonstreamresponse()
      t.equal(commonStreamResponse.getResponseid(), requestId, 'response id matches request id')
      t.equal(commonStreamResponse.getSequenceid(), callCount, `sequenceid is ${callCount}`)
      t.equal(commonStreamResponse.getMessage().getValue(), '', 'message is empty')

      t.equal(data.getHistogramschematype(), 2, 'histogram schema type')
      t.equal(data.getActivethreadcountList()[0], 1, 'active thread count')

      console.log(`dataCallbackOnServerCall callCount: ${callCount}`)
      if (callCount == 1) {
        dataSender.commandStream.writableStream.on('close', () => {
          t.end()
        })
        dataSender.close()
        server.forceShutdown()
      }
    }

    const callArguments = new CallArgumentsBuilder(function () {
      if (callArguments.once) {
        return
      }
      callArguments.once = true

      process.nextTick(() => {
        serverCallWriter(CommandType.activeThreadCount)
      })
    }).build()
    dataSender.sendSupportedServicesCommand(callArguments)
  })
})
