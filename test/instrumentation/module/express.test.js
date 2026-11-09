/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const axios = require('axios')
const { finished } = require('node:stream')
const { spanMessagesOfCurrentAgent } = require('../../support/collector-span-messages')
const express = require('express')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const DisableTrace = require('../../../lib/context/disable-trace')
const http = require('http')
const https = require('https')
const { getTransactionId, getDisabledId } = require('../../../lib/context/trace/id-generator')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const { TestGrpcDataSenderBuilder, SpanAdaptor, StatAdaptor, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const { waitForAgentStat } = require('../../support/wait-for-agent-stat')
const AgentStatsMonitor = require('../../../lib/metric/agent-stats-monitor')
const DataSender = require('../../../lib/client/data-sender')
const { UriStatsRepositoryBuilder } = require('../../../lib/metric/uri/uri-stats-repository')
const { UriStatsMonitor } = require('../../../lib/metric/uri/uri-stats-monitor')
const { sendRequestOverRawSocket } = require('../../support/raw-http-client')
const { ParentTraceHeader } = require('../../fixtures/parent-trace-header')
const { receiverTypeNameOfFunctionMethod } = require('../../support/stack-frame')
const RecordingDataSender = require('../../support/recording-data-sender')
const { startLocalHttpsServer } = require('../../support/local-https-server')

const TEST_ENV = {
  host: 'localhost', port: 5006
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const getUriStatsRepository = (traceContext) => {
  const enricher = traceContext.traceCompletionEnricher?.enrichers?.find((e) => {
    return e && typeof e.onComplete === 'function' && e.repository
  })
  return enricher?.repository ?? UriStatsRepositoryBuilder.nullObject
}

const testName1 = 'express1'
test(`${testName1} Should record request in basic route`, function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const testName = testName1

  const PATH = '/' + testName
  const app = new express()

  let getTraceRoot
  app.get(PATH, async (req, res) => {
    getTraceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok get')
  })

  let postTraceRoot
  app.post(PATH, (req, res) => {
    postTraceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok post')
  })

  let express2TraceRoot
  app.get('/express2', async (req, res) => {
    express2TraceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok get')
  })

  let errorOrder = 0
  let pathSymbol

  const express3Symbol = Symbol('express3')
  let express3TraceRoot
  app.get('/express3', (req, res, next) => {
    express3TraceRoot = agent.currentTraceObject().getTraceRoot()
    errorOrder++
    pathSymbol = express3Symbol
    throw new Error('error case')
  })

  const express4Symbol = Symbol('express4')
  let express4TraceRoot
  app.get('/express4', (req, res, next) => {
    express4TraceRoot = agent.currentTraceObject().getTraceRoot()
    errorOrder++
    pathSymbol = express4Symbol
    next(new Error('error case'))
  })

  const exceptionUnhandledSymbol = Symbol('exceptionUnhandled')
  let exceptionUnhandledTraceRoot
  app.get('/exception/unhandled', function (req, res, next) {
    exceptionUnhandledTraceRoot = agent.currentTraceObject().getTraceRoot()
    errorOrder++
    pathSymbol = exceptionUnhandledSymbol
    const error = new Error('Pinpoint unhandled exception test route')
    error.status = 500
    next(error)
  })

  app.use(function (err, req, res, next) {
    if (pathSymbol == express3Symbol) {
      t.equal(errorOrder, 1, 'express3 error order')
    }
    if (pathSymbol === express4Symbol) {
      t.equal(errorOrder, 2, 'express4 error order')
    }
    if (pathSymbol === exceptionUnhandledSymbol) {
      t.equal(errorOrder, 3, 'exception/unhandled error order')
    }

    res.status(500).send('Something broke!')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH) + '?api=test&test1=test')
    t.equal(result1.status, 200)

    const getSpan = await dataSender.waitForSpan(getTraceRoot)
    t.equal(getSpan.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
    t.equal(getSpan.annotations[0].value, 'api=test&test1=test', 'HTTP param value match')
    t.equal(getSpan.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
    t.equal(getSpan.annotations[1].value, 200, 'response status is 200')

    let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router'))
    t.equal(actualMethodDescriptor.apiId, getSpan.spanEventList[0].apiId, 'apiId')
    t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
    t.equal(actualMethodDescriptor.className, 'Router', 'className')
    t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')

    const result2 = await axios.post(getServerUrl(PATH))
    t.equal(result2.status, 200)

    const postSpan = await dataSender.waitForSpan(postTraceRoot)
    t.equal(postSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, '/express1 HTTP STATUS CODE in annotation zero')
    t.equal(postSpan.annotations[0].value, 200, '/express1 HTTP STATUS CODE value in annotation zero')

    actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('post').setClassName('Router'))
    t.equal(actualMethodDescriptor.apiId, postSpan.spanEventList[0].apiId, 'apiId')
    t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
    t.equal(actualMethodDescriptor.className, 'Router', 'className')
    t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')

    const result3 = await axios.get(getServerUrl('/express2'))
    t.equal(result3.status, 200)

    const express2Span = await dataSender.waitForSpan(express2TraceRoot)
    actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router'))
    t.equal(actualMethodDescriptor.apiId, express2Span.spanEventList[0].apiId, 'apiId')
    t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
    t.equal(actualMethodDescriptor.className, 'Router', 'className')
    t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')

    try {
      await axios.get(getServerUrl('/express3'))
    } catch (error) {
      t.equal(error.response.status, 500)
    }
    throwHandleTest(await dataSender.waitForSpan(express3TraceRoot), dataSender, t)

    try {
      await axios.get(getServerUrl('/express4'))
    } catch (error) {
      t.equal(error.response.status, 500, 'axios.get(getServerUrl(/express4))')
    }
    nextErrorHandleTest(await dataSender.waitForSpan(express4TraceRoot), dataSender, t)

    try {
      await axios.get(getServerUrl('/exception/unhandled'))
    } catch (error) {
      t.equal(error.response.status, 500, 'axios.get(getServerUrl(/exception/unhandled))')
    }
    unhandledExceptionStatsFrameTest(await dataSender.waitForSpan(exceptionUnhandledTraceRoot), dataSender, t)

    t.end()
    server.close()
  })
})

function throwHandleTest(span, dataSender, t) {
  t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), '/express3 HTTP_STATUS_CODE annotationKey matching')
  t.equal(span.annotations[0].value, 500, '/express3 HTTP_STATUS_CODE value matching')

  t.equal(span.traceRoot.getShared().getErrorCode(), 1, 'traceRoot errorCode should be 1')

  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = span.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = span.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualErrorMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = dataSender.findExceptionMetaData(span.traceRoot).valueOfProtocolBuffer()
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), span.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), span.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStarttime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), span.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), span.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), '/express3', 'ExceptionMetaData uriTemplate /express3')

  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  const actualSpanEventError = span.spanEventList[1].exception[0]
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

function nextErrorHandleTest(span, dataSender, t) {
  t.equal(span.traceRoot.getShared().getErrorCode(), 1, 'traceRoot errorCode should be 1')

  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = span.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = span.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualErrorMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = dataSender.findExceptionMetaData(span.traceRoot).valueOfProtocolBuffer()
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), span.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), span.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStarttime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), span.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), span.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), '/express4', 'ExceptionMetaData uriTemplate /express4')

  const actualSpanEventError = span.spanEventList[1].exception[0]
  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

function unhandledExceptionStatsFrameTest(span, dataSender, t) {
  const actualExceptionMetaData = dataSender.findExceptionMetaData(span.traceRoot)?.valueOfProtocolBuffer()
  t.ok(actualExceptionMetaData, 'ExceptionMetaData should be sent')

  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')

  const actualException = actualExceptions[0]
  const actualSpanEventError = span.spanEventList[1].exception[0]

  t.equal(actualException.getExceptionmessage(), actualSpanEventError.errorMessage, 'ExceptionMetaData exception message should match span event error message')
  t.equal(actualException.getExceptionid(), actualSpanEventError.exceptionId, 'ExceptionMetaData exception id should match span event exception id')

  const stackTraceElements = actualException.getStacktraceelementList()
  const frameStack = actualSpanEventError.frameStack

  t.equal(stackTraceElements.length, frameStack.length, 'ExceptionMetaData stacktraceelementList length should match span event frameStack length')
}

const testName2 = 'express2'
test(`[${testName2}] Should record request in express.Router`, function (t) {
  nullDataSenderAgent({ 'trace-location-and-filename-of-call-site': true })

  const testName = testName2

  t.plan(2)

  const PATH = '/' + testName
  const app = new express()

  const router1 = express.Router()
  router1.get(PATH, (req, res) => {
    res.send('ok router1')
  })

  const router2 = express.Router()
  router2.get(PATH, async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    res.send('ok router2')
  })

  app.use('/express.router1', router1)
  app.use('/express.router2', router2)

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(`/express.router1${PATH}`), {
      timeout: 1000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.status, 200)

    const result2 = await axios.get(getServerUrl(`/express.router2${PATH}`), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result2.status, 200)

    server.close()
  })
})

const testName3 = 'express3'
test(`${testName3} Should record request taking more than 2 sec`, async function (t) {
  nullDataSenderAgent({ 'trace-location-and-filename-of-call-site': true })
  const outgoingServer = await startLocalHttpsServer({ responseDelayMs: 2000 })
  t.teardown(() => outgoingServer.close())

  const testName = testName3

  t.plan(1)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res) => {
    // slow outgoing call
    try {
      await axios.get(outgoingServer.url, { httpsAgent: outgoingServer.agent() })
    } catch (error) {
      log.error(error)
    }
    res.send('hello')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.equal(result.status, 200)
    server.close()
  })
})

const testName5 = 'express5'
test(`${testName5} Should record middleware`, function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const testName = testName5

  const PATH = '/' + testName
  const app = new express()

  app.use((req, res, next) => {
    console.log('middleware1 : no path')
    next()
  })

  app.use(PATH, (req, res, next) => {
    console.log('middleware2 : matched path')
    next()
  })

  app.use(PATH + '/no', (req, res, next) => {
    console.log('middleware3 : not matched path')
    next()
  })

  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok router1')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.status, 200)

    const span = await dataSender.waitForSpan(traceRoot)
    let actualBuilder = new MethodDescriptorBuilder('get')
      .setClassName('Router')
    const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
    let spanEvent = span.spanEventList[2]
    t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
    t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
    t.equal(actualMethodDescriptor.className, 'Router', 'className')
    t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    t.equal(spanEvent.sequence, 2, 'sequence')
    t.equal(spanEvent.depth, 1, 'spanEvent.depth')

    actualBuilder = new MethodDescriptorBuilder('use')
      .setClassName('Router')
    const actualMiddleware1MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
    spanEvent = span.spanEventList[1]
    t.equal(actualMiddleware1MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
    t.equal(actualMiddleware1MethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
    t.equal(actualMiddleware1MethodDescriptor.className, 'Router', 'className')
    t.equal(actualMiddleware1MethodDescriptor.functionName, 'use', 'functionName')
    t.equal(spanEvent.sequence, 1, 'sequence')
    t.equal(spanEvent.depth, 1, 'spanEvent.depth')

    actualBuilder = new MethodDescriptorBuilder('use')
      .setClassName('Router')
    const actualMiddleware2MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
    spanEvent = span.spanEventList[0]
    t.equal(actualMiddleware2MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
    t.equal(actualMiddleware2MethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
    t.equal(actualMiddleware2MethodDescriptor.className, 'Router', 'className')
    t.equal(actualMiddleware2MethodDescriptor.methodName, 'use', 'methodName')
    t.equal(spanEvent.sequence, 0, 'sequence')
    t.equal(spanEvent.depth, 1, 'spanEvent.depth')

    t.end()
    server.close()
  })
})

const testName6 = 'express6'
test(`${testName6} Should record each http method`, function (t) {
  nullDataSenderAgent({ 'trace-location-and-filename-of-call-site': true })

  const testName = testName6

  t.plan(5)

  const PATH = '/' + testName
  const app = new express()

  app.route(PATH)
    .get((req, res) => {
      res.send('ok get')
    })
    .post((req, res) => {
      res.send('ok post')
    })
    .put((req, res) => {
      res.send('ok put')
    })
    .patch((req, res) => {
      res.send('ok patch')
    })
    .delete((req, res) => {
      res.send('ok delete')
    })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH))
    t.equal(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.equal(result2.status, 200)

    const result3 = await axios.put(getServerUrl(PATH))
    t.equal(result3.status, 200)

    const result4 = await axios.patch(getServerUrl(PATH))
    t.equal(result4.status, 200)

    const result5 = await axios.delete(getServerUrl(PATH))
    t.equal(result5.status, 200)

    server.close()
  })
})

test('express version check', (t) => {
  const hook = require('../../../lib/instrumentation/module/express')
  const expected = { name: 'module' }
  const agent = nullDataSenderAgent()
  let actual = hook(agent, '5.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0 test')

  actual = hook(agent, '5.0.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0.0 test')
  t.end()
})

test('incoming request by Disable Trace requests', (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({ 'sampling': { 'rate': 3 } }).setDataSender(dataSender).build()
  let actualTraceIdTransactionId = 0
  let actualRequestCount = 0

  const app = new express()
  const rootPathTraces = []
  app.get('/', async (req, res) => {
    actualRequestCount++
    const trace = agent.currentTraceObject()
    rootPathTraces.push(trace)
    const traceRoot = trace.getTraceRoot()
    actualTraceIdTransactionId = traceRoot.transactionId

    if (actualRequestCount == 1 || actualRequestCount == 4) {
      t.equal('' + (getTransactionId().sequence - 1), actualTraceIdTransactionId, `traceRoot.transactionId equals transactionIdGenerator.sequence ${traceRoot.transactionId}`)
    } else {
      t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
      t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'DisableTrace transaction no updated transactionIdGenerator.sequence')
    }

    const result = await axios.get(getServerUrl('/api'), {
      timeout: 10000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'api request status code is 200')
    t.equal(result.data, 'ok /api get', 'api request data is ok /api get')
    res.send('ok get')
  })

  const apiRequests = []
  const apiPathTraces = []
  app.get('/api', async (req, res) => {
    apiRequests.push(req)
    const trace = agent.currentTraceObject()
    apiPathTraces.push(trace)
    if (actualRequestCount == 1 || actualRequestCount == 4) {
      t.equal(actualTraceIdTransactionId, trace.getTraceId().transactionId, 'API transaction id sequence equals transactionIdGenerator.sequence')
    } else {
      t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
      t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'API DisableTrace transaction no updated transactionIdGenerator.sequence')
    }

    const result = await axios.get(getServerUrl('/api2'), {
      timeout: 10000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'api2 request status code is 200')
    t.equal(result.data, 'ok /api2 get', 'api request data is ok /api2 get')
    res.send('ok /api get')
  })

  const apiRequests2 = []
  const apiPathTraces2 = []
  app.get('/api2', async (req, res) => {
    apiRequests2.push(req)
    const trace = agent.currentTraceObject()
    apiPathTraces2.push(trace)
    if (actualRequestCount == 1 || actualRequestCount == 4) {
      t.equal(actualTraceIdTransactionId, trace.getTraceId().transactionId, 'API transaction id sequence equals transactionIdGenerator.sequence')
    } else {
      t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
      t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'API DisableTrace transaction no updated transactionIdGenerator.sequence')
    }
    res.send('ok /api2 get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl('/'), {
      timeout: 20000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.status, 200, 'first / request status code is 200')

    let actualTrace = rootPathTraces[0]
    const rootSpan = await dataSender.waitForSpan(actualTrace.getTraceRoot())
    t.equal(rootSpan.rpc, '/', 'HTTP Request URI')
    t.equal(rootSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
    t.equal(rootSpan.annotations[0].value, 200, 'response status is 200')

    let actualApiTrace = apiPathTraces[0]
    const apiSpan = await dataSender.waitForSpan(actualApiTrace.getTraceRoot())
    t.equal(rootSpan.traceRoot.getTraceId().getSpanId(), apiSpan.traceRoot.getTraceId().getParentSpanId(), 'parent span id equals to root span id')
    t.equal(apiSpan.rpc, '/api', 'HTTP Request URI')
    t.equal(apiSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
    t.equal(apiSpan.annotations[0].value, 200, 'response status is 200')

    let actualApiRequest = apiRequests[0]
    t.equal(actualApiRequest.url, '/api', 'api request url is /api')
    t.equal(actualApiRequest.headers['pinpoint-host'], apiSpan.endPoint, 'api request pinpoint-host header is localhost:5006')
    t.equal(actualApiRequest.headers['pinpoint-flags'], '0', 'api request pinpoint-flags header is 0')
    t.equal(actualApiRequest.headers['pinpoint-sampled'], undefined, 'api request pinpoint-sampled header is s0')
    t.equal(actualApiRequest.headers['pinpoint-pappname'], agent.getConfig().getApplicationName(), 'pinpoint-pappname header is the Config applicationName')
    t.equal(actualApiRequest.headers['pinpoint-papptype'], '1400', 'pinpoint-papptype header is NODE 1400')
    t.equal(actualApiRequest.headers['pinpoint-pspanid'], actualTrace.getTraceId().getSpanId(), 'pinpoint-pspanid header is root span id')
    t.equal(actualApiRequest.headers['pinpoint-spanid'], actualApiTrace.getTraceId().getSpanId(), 'pinpoint-spanid header is api span id')
    t.equal(actualApiRequest.headers['pinpoint-traceid'], actualTrace.getTraceId().toStringDelimiterFormatted(), 'pinpoint-traceid header is root transaction id')
    t.equal(actualTrace.getTraceId().getAgentId(), actualApiTrace.getTraceId().getAgentId(), '1st TraceId.agentId equals 2nd TraceId.agentId')
    t.equal(actualTrace.getTraceId().getAgentStartTime(), actualApiTrace.getTraceId().getAgentStartTime(), '1st TraceId.agentStartTime equals 2nd TraceId.agentStartTime')
    t.equal(actualTrace.getTraceId().transactionId, actualApiTrace.getTraceId().transactionId, '1st TraceId.transactionSequence equals 2nd TraceId.transactionSequence')

    const result2 = await axios.get(getServerUrl('/'), {
      timeout: 20000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result2.status, 200, 'second / request status code is 200')

    actualTrace = rootPathTraces[1]
    t.true(actualTrace instanceof DisableTrace, 'HTTP Request URI')

    actualApiRequest = apiRequests[1]
    t.equal(actualApiRequest.url, '/api', 'DisableTrace api request url is /api')
    t.equal(actualApiRequest.headers['pinpoint-sampled'], 's0', 'DisableTrace api request pinpoint-sampled header is s0')

    const result3 = await axios.get(getServerUrl('/'), {
      timeout: 20000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result3.status, 200, 'third / request status code is 200')

    actualTrace = rootPathTraces[2]
    t.true(actualTrace instanceof DisableTrace, 'third HTTP Request URI is DisableTrace')

    actualApiRequest = apiRequests[2]
    t.equal(actualApiRequest.url, '/api', 'Third request is DisableTrace api request url is /api')
    t.equal(actualApiRequest.headers['pinpoint-sampled'], 's0', 'Third request is DisableTrace api request pinpoint-sampled header is s0')

    const result4 = await axios.get(getServerUrl('/'), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result4.status, 200, 'third / request status code is 200')

    t.end()
    server.close()
  })
})

test('express should record handler registered with pattern route', (t) => {
  t.plan(8)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const app = new express()
  const PATH = '/users/:userId/books/:bookId'

  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok pattern')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/users/42/books/abc'))
    t.equal(result.status, 200, 'pattern route responds 200')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.rpc, '/users/42/books/abc', 'rpc should capture concrete request path')
    t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code annotation key')
    t.equal(span.annotations[0].value, 200, 'HTTP status code is 200')
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate should capture pattern route')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), 'GET', 'httpMethod is GET')

    const md = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router'))
    const spanEvent = span.spanEventList[0]
    t.equal(md.apiDescriptor, 'Router.get', 'method descriptor uses Router.get')
    t.equal(md.apiId, spanEvent.apiId, 'apiId matches span event')

    server.close()
  })
})

test('express with error analysis disabled responds to a throwing handler and records its span', (t) => {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ features: { errorAnalysis: { enabled: false } } }).setDataSender(dataSender).build()

  const app = new express()
  app.get('/error-analysis-disabled/throw', () => {
    throw new Error('express error analysis disabled')
  })
  app.use((err, req, res, next) => {
    res.status(500).send('error')
  })

  const server = app.listen(0, () => {
    http.get({ port: server.address().port, path: '/error-analysis-disabled/throw' }, (response) => {
      response.resume()
      response.on('end', () => setImmediate(() => {
        t.equal(response.statusCode, 500, 'the error middleware responds 500')
        t.equal(dataSender.spans().length, 1, 'the span is sent')
        const span = dataSender.spans()[0]
        t.equal(span.traceRoot.getShared().getErrorCode(), 1, 'the span is marked as error')
        const errorSpanEvent = span.spanEventList.find(spanEvent => spanEvent.exceptionInfo)
        t.ok(errorSpanEvent, 'the error middleware span event records the exception info')
        t.equal(errorSpanEvent.exceptionInfo.intValue, 1, 'exceptionInfo intValue should be 1')
        t.equal(errorSpanEvent.exception, undefined, 'exception object should not be set')
        t.equal(dataSender.exceptionMetaData().length, 0, 'no exception meta data is sent')
        server.close()
        t.end()
      }))
    })
  })
})

test('express should disable uriTemplate/httpMethod enrichment and use null repository when isUriStatsEnabled is false', (t) => {
  t.plan(5)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    "features": {
      "uriStats": undefined
    }
  }).setDataSender(dataSender).build()

  const app = new express()
  const PATH = '/uri-stats-disabled/:orderId'

  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok uri off')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-disabled/123'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri off', 'response data is ok uri off')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'uriTemplate should be undefined when uriStats is disabled')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod should be undefined when uriStats is disabled')
    t.equal(getUriStatsRepository(agent.getTraceContext()), UriStatsRepositoryBuilder.nullObject, 'UriStatsRepository should be nullObject when uriStats is disabled')
    server.close()
  })
})

test('express should keep uriTemplate but skip httpMethod when isUriStatsHttpMethodEnabled is false', (t) => {
  t.plan(5)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    "features": {
      "uriStats": {
        "httpMethod": false
      }
    }
  }).setDataSender(dataSender).build()

  const app = new express()
  const PATH = '/uri-stats-method-disabled/:orderId'

  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok uri method off')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-method-disabled/999'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri method off', 'response data is ok uri method off')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate recorded when uri stats enabled')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod not recorded when httpMethod flag disabled')
    t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'status code annotation exists')
    server.close()
  })
})

test('Should aggregate URI stats in UriStatsRepository', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats'
  const app = new express()
  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok stats')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await dataSender.waitForSpan(traceRoot)
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      if (snapshot) {
        const expectedKey = `GET ${PATH}`
        const entry = snapshot.dataMap.get(expectedKey)

        t.ok(entry, `Entry for ${expectedKey} exists`)
        if (entry) {
          t.equal(entry.totalHistogram.count, 1, 'Request counted in histogram')
        }
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats without HTTP method when disabled in config', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  }).setDataSender(dataSender).build()

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/no-method'
  const app = new express()
  let traceRoot
  app.get(PATH, (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok stats no method')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await dataSender.waitForSpan(traceRoot)
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      // When httpMethod is disabled, the key should be just the PATH
      const expectedKey = PATH
      const entry = snapshot.dataMap.get(expectedKey)

      t.ok(entry, `Entry for ${expectedKey} exists`)
      if (entry) {
        t.equal(entry.totalHistogram.count, 1, 'Request counted in histogram')
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats for DisableTrace in Express', function (t) {
  const agent = nullDataSenderAgent({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/disable-trace'
  const app = new express()
  let traceCompleted
  app.get(PATH, (req, res) => {
    traceCompleted = new Promise(resolve => finished(res, resolve))
    res.send('ok stats disable trace')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceCompleted
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      const expectedKey = PATH
      const entry = snapshot.dataMap.get(expectedKey)

      t.ok(entry, `Entry for ${expectedKey} exists`)
      if (entry) {
        t.equal(entry.totalHistogram.count, 1, 'DisableTrace request counted in histogram')
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Functional Test: requestExceptionMetaData should deliver converted exception stack for /exception/unhandled', (t) => {
  let metadataReceived
  const metadataReceivedPromise = new Promise((resolve, reject) => {
    metadataReceived = { resolve, reject }
  })

  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(new MetadataAdaptor({
    requestExceptionMetaData: (call, callback) => {
      callback(null, new spanMessages.PResult())

      try {
        const exceptionMetaData = call.request
        t.ok(exceptionMetaData, 'ExceptionMetaData should be delivered to collector')
        t.ok(exceptionMetaData.getTransactionid(), 'transactionId should exist')
        t.ok(exceptionMetaData.getSpanid(), 'spanId should exist')
        t.equal(exceptionMetaData.getUritemplate(), '/exception/unhandled', 'uriTemplate should be route path')

        const exceptions = exceptionMetaData.getExceptionsList()
        t.equal(exceptions.length, 1, 'exceptions length should be 1')

        const exception = exceptions[0]
        t.equal(exception.getExceptionclassname(), 'Error', 'exception class should be Error')
        t.equal(exception.getExceptionmessage(), 'Pinpoint unhandled exception test route', 'exception message should match')
        t.ok(exception.getExceptionid() > 0, 'exception id should be greater than 0')
        t.equal(exception.getExceptiondepth(), 0, 'exception depth should be 0')

        const stackTraceElements = exception.getStacktraceelementList()

        const actualStackTrace = stackTraceElements
          .map((pStackTraceElement) => {
            const className = pStackTraceElement.getClassname() || ''
            const methodName = pStackTraceElement.getMethodname() || '<anonymous>'
            const fileName = pStackTraceElement.getFilename() || 'unknown'
            const lineNumber = pStackTraceElement.getLinenumber()
            const typePrefix = className ? `${className}.` : ''
            return `${typePrefix}${methodName} (${fileName}:${lineNumber})`
          })
          .join('\n')

        const expectedStackTracePrefix = [
          'express.test.js.<anonymous> (<workspace>/test/instrumentation/module/express.test.js:<line>)',
          'Layer.handle [as handle_request] (<workspace>/node_modules/express/lib/router/layer.js:<line>)',
          'route.js.next (<workspace>/node_modules/express/lib/router/route.js:<line>)',
          'Route.dispatch (<workspace>/node_modules/express/lib/router/route.js:<line>)',
          'InterceptorRunner.run (<workspace>/lib/instrumentation/interceptor-runner.js:<line>)',
          'express-layer-interceptor.js.wrapped (<workspace>/lib/instrumentation/module/express/express-layer-interceptor.js:<line>)',
          'Layer.handle [as handle_request] (<workspace>/node_modules/express/lib/router/layer.js:<line>)',
          'index.js.<anonymous> (<workspace>/node_modules/express/lib/router/index.js:<line>)',
          `${receiverTypeNameOfFunctionMethod('router')}.process_params (<workspace>/node_modules/express/lib/router/index.js:<line>)`,
          'index.js.next (<workspace>/node_modules/express/lib/router/index.js:<line>)',
        ].join('\n')

        const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const workspacePath = process.cwd().replace(/\\/g, '/')
        const normalizeStackTrace = (stackTrace) => {
          return stackTrace
            .replace(/\\/g, '/')
            .replace(new RegExp(escapeRegExp(workspacePath), 'g'), '<workspace>')
            .replace(/express\.test\.js:\d+/g, 'express.test.js:<line>')
            .replace(/interceptor-runner\.js:\d+/g, 'interceptor-runner.js:<line>')
            .replace(/express-layer-interceptor\.js:\d+/g, 'express-layer-interceptor.js:<line>')
            .replace(/(node_modules\/express\/lib\/router\/[a-zA-Z0-9_-]+\.js):\d+/g, '$1:<line>')
        }

        const normalizedActualLines = normalizeStackTrace(actualStackTrace).split('\n')
        const normalizedExpectedPrefixLines = normalizeStackTrace(expectedStackTracePrefix).split('\n')

        t.ok(actualStackTrace.includes('Pinpoint unhandled exception test route') === false, 'stack trace should not include error message line')
        t.deepEqual(
          normalizedActualLines.slice(0, normalizedExpectedPrefixLines.length),
          normalizedExpectedPrefixLines,
          'gRPC delivered stack trace should match stable prefix frames as multiline string'
        )

        metadataReceived.resolve()
      } catch (error) {
        metadataReceived.reject(error)
      }
    }
  })).addAdaptor(new SpanAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    new ProcessAgentBuilder().setDataSender(new DataSender(grpcDataSender.config, grpcDataSender)).build()

    const app = new express()
    app.get('/exception/unhandled', function (req, res, next) {
      const error = new Error('Pinpoint unhandled exception test route')
      error.status = 500
      next(error)
    })
    app.use(function (err, req, res, next) {
      res.status(500).send('Something broke!')
    })

    const server = app.listen(0, async () => {
      try {
        const serverPort = server.address().port
        const response = await axios.get(`http://localhost:${serverPort}/exception/unhandled`, {
          validateStatus: () => true,
          httpAgent: new http.Agent({ keepAlive: false }),
          httpsAgent: new https.Agent({ keepAlive: false }),
        })

        t.equal(response.status, 500, 'route should return 500')
        await metadataReceivedPromise
      } catch (error) {
        t.fail(error?.stack || error?.message || String(error))
      } finally {
        server.close(() => {
          grpcDataSender.close()
          t.end()
        })
      }
    })
  })
})

test('Functional Test: requestExceptionMetaData should deliver error.cause chain', (t) => {
  let metadataReceived
  const metadataReceivedPromise = new Promise((resolve, reject) => {
    metadataReceived = { resolve, reject }
  })

  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(new MetadataAdaptor({
    requestExceptionMetaData: (call, callback) => {
      callback(null, new spanMessages.PResult())

      try {
        const exceptionMetaData = call.request
        t.ok(exceptionMetaData, 'ExceptionMetaData should be delivered')

        const exceptions = exceptionMetaData.getExceptionsList()
        t.equal(exceptions.length, 2, 'should have 2 exceptions in cause chain')

        const top = exceptions[0]
        t.equal(top.getExceptionclassname(), 'Error', 'top exception class is Error')
        t.equal(top.getExceptionmessage(), 'request failed', 'top exception message')
        t.equal(top.getExceptiondepth(), 0, 'top exception depth is 0')

        const cause = exceptions[1]
        t.equal(cause.getExceptionclassname(), 'TypeError', 'cause class is TypeError')
        t.equal(cause.getExceptionmessage(), 'root cause', 'cause message')
        t.equal(cause.getExceptiondepth(), 1, 'cause depth is 1')

        t.equal(top.getExceptionid(), cause.getExceptionid(), 'shared exceptionId')
        t.ok(cause.getStacktraceelementList().length > 0, 'cause should have stack trace')

        metadataReceived.resolve()
      } catch (error) {
        metadataReceived.reject(error)
      }
    }
  })).addAdaptor(new SpanAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    new ProcessAgentBuilder().setDataSender(new DataSender(grpcDataSender.config, grpcDataSender)).build()

    const app = new express()
    app.get('/exception/cause-chain', function (req, res, next) {
      const rootCause = new TypeError('root cause')
      const error = new Error('request failed', { cause: rootCause })
      error.status = 500
      next(error)
    })
    app.use(function (err, req, res, next) {
      res.status(500).send('error')
    })

    const server = app.listen(0, async () => {
      try {
        const serverPort = server.address().port
        const response = await axios.get(`http://localhost:${serverPort}/exception/cause-chain`, {
          validateStatus: () => true,
          httpAgent: new http.Agent({ keepAlive: false }),
          httpsAgent: new https.Agent({ keepAlive: false }),
        })

        t.equal(response.status, 500, 'route should return 500')
        await metadataReceivedPromise
      } catch (error) {
        t.fail(error?.stack || error?.message || String(error))
      } finally {
        server.close(() => {
          grpcDataSender.close()
          t.end()
        })
      }
    })
  })
})

test('Functional Test: SendSpan with success and failure', (t) => {
  const receivedSpans = []
  const receivedStats = []

  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(new SpanAdaptor({
    sendSpanBatch: (call, callback) => {
      spanMessagesOfCurrentAgent(call.request).forEach((spanMessage) => {
        receivedSpans.push(spanMessage)
      })
      callback(null, new spanMessages.PSpanResultBatch())
    }
  })).addAdaptor(new StatAdaptor({
    sendAgentStat: (call) => {
      call.on('data', (statMessage) => {
        receivedStats.push(statMessage)
      })
      call.on('end', () => {
        call.end()
      })
    }
  })).addAdaptor(new MetadataAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    const agent = new ProcessAgentBuilder().setDataSender(new DataSender(grpcDataSender.config, grpcDataSender)).build()

    const app = new express()
    const successPath = '/functional/success'
    const failPath = '/functional/fail'

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    app.get(successPath, async function (req, res) {
      if (req.query.delay) {
        await sleep(parseInt(req.query.delay))
      }
      res.send('ok')
    })
    app.get(failPath, async function (req, res, next) {
      try {
        if (req.query.delay) {
          await sleep(parseInt(req.query.delay))
        }
        throw new Error('functional test error')
      } catch (e) {
        next(e)
      }
    })
    app.use(function (err, req, res, next) {
      res.status(500).send('error')
    })

    const server = app.listen(0, async () => {
      const serverPort = server.address().port

      // 1. Send requests with various latencies to test histogram buckets
      // Bucket 0: < 100ms
      await axios.get('http://localhost:' + serverPort + successPath)

      // Bucket 1: < 300ms (100ms ~ 300ms)
      await axios.get('http://localhost:' + serverPort + successPath + '?delay=150')

      // Bucket 2: < 500ms (300ms ~ 500ms)
      await axios.get('http://localhost:' + serverPort + successPath + '?delay=350')

      // Bucket 3: < 1000ms (500ms ~ 1000ms)
      await axios.get('http://localhost:' + serverPort + successPath + '?delay=600')

      // Bucket 4: < 3000ms (1000ms ~ 3000ms)
      await axios.get('http://localhost:' + serverPort + successPath + '?delay=1100')

      // Fail requests
      try {
        await axios.get('http://localhost:' + serverPort + failPath) // Bucket 0
      } catch (e) { }

      try {
        // Bucket 1 for failure
        await axios.get('http://localhost:' + serverPort + failPath + '?delay=150')
      } catch (e) { }

      const repository = getUriStatsRepository(agent.getTraceContext())
      repository.timeWindow = 1000
      const monitor = new UriStatsMonitor(new DataSender(grpcDataSender.config, grpcDataSender), repository)
      monitor.start()

      setTimeout(() => {
        t.equal(receivedSpans.length, 7, 'Should receive 7 spans')

        const successSpanMsg = receivedSpans.find(msg => msg.getSpan().getAcceptevent().getRpc() === successPath)
        const failSpanMsg = receivedSpans.find(msg => msg.getSpan().getAcceptevent().getRpc() === failPath)

        t.ok(successSpanMsg, 'Success span found')
        if (successSpanMsg) {
          const span = successSpanMsg.getSpan()
          t.equal(span.getErr(), 0, 'Success span should have err=0')
        }

        t.ok(failSpanMsg, 'Fail span found')
        if (failSpanMsg) {
          const span = failSpanMsg.getSpan()
          t.equal(span.getErr(), 1, 'Fail span should have err=1')

          const spanEvents = span.getSpaneventList()
          const eventWithException = spanEvents.find(e => {
            const info = e.getExceptioninfo()
            return info && info.getStringvalue && info.getStringvalue()
          })
          t.ok(eventWithException, 'Should find span event with exception info')

          if (eventWithException) {
            const title = eventWithException.getExceptioninfo().getStringvalue().getValue()
            t.true(title.startsWith('Error: functional test error'), 'Fail span event should have exception info')
          }
        }

        t.ok(receivedStats.length > 0, 'Should receive stats')
        if (receivedStats.length > 0) {
          const mergedStats = {}

          receivedStats.forEach(statMsg => {
            const agentUriStat = statMsg.getAgenturistat()
            if (agentUriStat) {
              const eachList = agentUriStat.getEachuristatList()
              if (eachList) {
                eachList.forEach(each => {
                  const uri = each.getUri()
                  if (!mergedStats[uri]) {
                    mergedStats[uri] = {
                      totalBuckets: new Array(8).fill(0),
                      failedBuckets: new Array(8).fill(0)
                    }
                  }

                  const totalHistList = each.getTotalhistogram().getHistogramList()
                  totalHistList.forEach((count, idx) => mergedStats[uri].totalBuckets[idx] += count)

                  const failedHistList = each.getFailedhistogram().getHistogramList()
                  failedHistList.forEach((count, idx) => mergedStats[uri].failedBuckets[idx] += count)
                })
              }
            }
          })

          const successUriKey = `GET ${successPath}`
          const successStat = mergedStats[successUriKey]

          t.ok(successStat, `Stats found for ${successPath}`)
          if (successStat) {
            const totalBuckets = successStat.totalBuckets
            const totalCount = totalBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(totalCount, 5, 'Total count should be 5 for success')

            t.equal(totalBuckets[0], 1, 'Bucket 0 (<100ms) should have 1 count')
            t.equal(totalBuckets[1], 1, 'Bucket 1 (<300ms) should have 1 count')
            t.equal(totalBuckets[2], 1, 'Bucket 2 (<500ms) should have 1 count')
            t.equal(totalBuckets[3], 1, 'Bucket 3 (<1000ms) should have 1 count')
            t.equal(totalBuckets[4], 1, 'Bucket 4 (<3000ms) should have 1 count')

            const failedBuckets = successStat.failedBuckets
            const failedCount = failedBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(failedCount, 0, 'Failed count should be 0 for success')
          }

          const failUriKey = `GET ${failPath}`
          const failStat = mergedStats[failUriKey]

          t.ok(failStat, `Stats found for ${failPath}`)
          if (failStat) {
            const totalBuckets = failStat.totalBuckets
            const totalCount = totalBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(totalCount, 2, 'Total count should be 2 for fail')

            t.equal(totalBuckets[0], 1, 'Bucket 0 (<100ms) should have 1 count')
            t.equal(totalBuckets[1], 1, 'Bucket 1 (<300ms) should have 1 count')

            const failedBuckets = failStat.failedBuckets
            const failedCount = failedBuckets.reduce((acc, val) => acc + val, 0)
            t.equal(failedCount, 2, 'Failed count should be 2 for fail')
            t.equal(failedBuckets[0], 1, 'Failed Bucket 0 (<100ms) should have 1 count')
            t.equal(failedBuckets[1], 1, 'Failed Bucket 1 (<300ms) should have 1 count')
          }
        }
        monitor.stop()

        server.close()
        grpcDataSender.close()
        t.end()
      }, 5000)
    })
  })
})

test('Express: Should record request with custom uri template when configured', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: {
      uriStats: {
        useUserInput: true
      }
    }
  }).setDataSender(dataSender).build()

  const app = new express()
  const PATH = '/custom-uri-merge-test'

  let traceRoot
  app.get(PATH, async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    // Simulate user input for uri template
    req['pinpoint.metric.uri-template'] = '/user/input/uri/merged'
    res.send('ok get merged')
  })

  // Start server on a different port to avoid conflict
  const port = TEST_ENV.port + 1
  const getServerUrl = (path) => `http://${TEST_ENV.host}:${port}${path}`

  const server = app.listen(port, async () => {
    try {
      await axios.get(getServerUrl(PATH))
      const span = await dataSender.waitForSpan(traceRoot)
      t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), '/user/input/uri/merged', 'Uri template match from merged test')
    } catch (error) {
      t.fail(error.message)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should count failure in URI stats for DisableTrace in Express', function (t) {
  const agent = nullDataSenderAgent({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/disable-trace-failure'
  const app = new express()
  let traceCompleted
  app.get(PATH, function (req, res, next) {
    traceCompleted = new Promise(resolve => finished(res, resolve))
    next(new Error('disable trace failure test'))
  })
  app.use(function (err, req, res, next) {
    res.status(500).send('error')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        validateStatus: () => true,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceCompleted
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      const expectedKey = PATH
      const entry = snapshot.dataMap.get(expectedKey)

      t.ok(entry, `Entry for ${expectedKey} exists`)
      if (entry) {
        t.equal(entry.totalHistogram.count, 1, 'DisableTrace failure request counted in total histogram')
        t.equal(entry.failedHistogram.count, 1, 'DisableTrace failure request counted in failed histogram')
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Express: Should not override uri template from user input when useUserInput is false', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: {
      uriStats: {
        useUserInput: false
      }
    }
  }).setDataSender(dataSender).build()

  const app = new express()
  const PATH = '/custom-uri-no-override'

  let traceRoot
  app.get(PATH, async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    req['pinpoint.metric.uri-template'] = '/user/input/should-not-override'
    res.send('ok no override')
  })

  const port = TEST_ENV.port + 2
  const getServerUrl = (path) => `http://${TEST_ENV.host}:${port}${path}`

  const server = app.listen(port, async () => {
    try {
      await axios.get(getServerUrl(PATH))
      const span = await dataSender.waitForSpan(traceRoot)
      t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'Route template should be preserved when useUserInput is false')
    } catch (error) {
      t.fail(error.message)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Express: Should not mark a client disconnect before the response as an error', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/client-disconnect'
  const app = new express()
  let client
  app.get(PATH, function (req, res) {
    dataSender.waitForSpan(agent.currentTraceObject().getTraceRoot()).then(assertSuccess)
    res.on('close', () => res.send('ok'))
    client.destroy()
  })

  const server = app.listen(0, () => {
    client = sendRequestOverRawSocket(server.address().port, PATH)
  })

  function assertSuccess(span) {
    t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code annotation is recorded')
    t.equal(span.annotations[0].value, 200, 'HTTP status code is 200')
    t.equal(span.traceRoot.getShared().getErrorCode(), undefined, 'client disconnect does not mark the error code')

    const repository = getUriStatsRepository(agent.getTraceContext())
    t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

    const timeWindow = 30000
    const baseTimestamp = Math.floor(DateNow.now() / timeWindow) * timeWindow
    const entry = repository.snapshotManager.getCurrent(baseTimestamp)?.dataMap.get(`GET ${PATH}`)
    t.ok(entry, `Entry for GET ${PATH} exists`)
    if (entry) {
      t.equal(entry.totalHistogram.count, 1, 'client disconnect counted in total histogram')
      t.equal(entry.failedHistogram.count, 0, 'client disconnect not counted in failed histogram')
    }

    server.close()
    t.end()
  }
})

test('Express: v4 serviceName is sent as Pinpoint-pServiceName and an inbound one is recorded as parentServiceName', function (t) {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ serviceName: 'express.service' }).setDataSender(dataSender).build()

  const PATH = '/parent-service-name'
  const OUTGOING_PATH = '/parent-service-name/outgoing'
  const app = new express()
  let outgoingRequestHeaders
  app.get(PATH, async (req, res) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    res.send('ok')
  })
  app.get(OUTGOING_PATH, (req, res) => {
    outgoingRequestHeaders = req.headers
    res.send('ok')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { headers: ParentTraceHeader.header('pinpoint-pservicename', 'parent.service'), httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-pservicename'], 'express.service', 'outgoing request has Pinpoint-pServiceName header of the Config serviceName')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.parentServiceName, 'parent.service', 'span parentServiceName is the inbound Pinpoint-pServiceName')
      t.equal(span.toProtocolBuffer().getSpan().getAcceptevent().getParentinfo().getParentservicename(), 'parent.service', 'PParentInfo.parentServiceName is the inbound Pinpoint-pServiceName')

      const outgoingSpan = dataSender.spans().find(span => span.rpc === OUTGOING_PATH)
      t.equal(outgoingSpan.parentServiceName, 'express.service', 'next hop span parentServiceName is this agent serviceName')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Express: v3 sends no Pinpoint-pServiceName and an inbound request without it leaves parentServiceName unset', function (t) {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ serviceName: 'ignored.service', collector: { ip: '127.0.0.1', spanPort: -1, statPort: -1, tcpPort: -1, protocolVersion: 'v3' } }).setDataSender(dataSender).build()

  const PATH = '/parent-service-name'
  const OUTGOING_PATH = '/parent-service-name/outgoing'
  const app = new express()
  let outgoingRequestHeaders
  app.get(PATH, async (req, res) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    res.send('ok')
  })
  app.get(OUTGOING_PATH, (req, res) => {
    outgoingRequestHeaders = req.headers
    res.send('ok')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { headers: ParentTraceHeader.header('pinpoint-pappname', 'parent.application'), httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-pappname'], 'test.application.name', 'outgoing request has Pinpoint-pAppName header')
      t.equal(outgoingRequestHeaders['pinpoint-pservicename'], undefined, 'v3 outgoing request has no Pinpoint-pServiceName header even with serviceName set')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.parentApplicationName, 'parent.application', 'span parentApplicationName is the inbound Pinpoint-pAppName')
      t.equal(span.parentServiceName, undefined, 'span parentServiceName is unset')
      t.equal(span.toProtocolBuffer().getSpan().getAcceptevent().getParentinfo().getParentservicename(), '', 'PParentInfo.parentServiceName is unset')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Express: application service type is NODE 1400 even with PINPOINT_SERVICE_TYPE and json applicationServiceType', function (t) {
  process.env.PINPOINT_SERVICE_TYPE = '1600'
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ applicationServiceType: 1500 }).setDataSender(dataSender).build()
  delete process.env.PINPOINT_SERVICE_TYPE

  const PATH = '/application-service-type'
  const OUTGOING_PATH = '/application-service-type/outgoing'
  const app = new express()
  let outgoingRequestHeaders
  app.get(PATH, async (req, res) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    res.send('ok')
  })
  app.get(OUTGOING_PATH, (req, res) => {
    outgoingRequestHeaders = req.headers
    res.send('ok')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-papptype'], '1400', 'outgoing request has Pinpoint-pAppType header of NODE 1400')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.toProtocolBuffer().getSpan().getApplicationservicetype(), 1400, 'PSpan.applicationServiceType is NODE 1400')

      const outgoingSpan = dataSender.spans().find(span => span.rpc === OUTGOING_PATH)
      t.equal(outgoingSpan.parentApplicationType, 1400, 'next hop span parentApplicationType is NODE 1400')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Express: AgentStat sends the transaction count and response time of completed requests', (t) => {
  const receivedAgentStats = []
  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(new StatAdaptor({
    sendAgentStat: (call) => {
      call.on('data', (statMessage) => {
        if (statMessage.getAgentstat()) {
          receivedAgentStats.push(statMessage.getAgentstat())
        }
      })
      call.on('end', () => call.end())
    }
  })).addAdaptor(new SpanAdaptor())
    .addAdaptor(new MetadataAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    const agent = new ProcessAgentBuilder().setDataSender(new DataSender(grpcDataSender.config, grpcDataSender)).build()
    const agentStatsMonitor = new AgentStatsMonitor(grpcDataSender, agent.getConfig().getAgentId(), agent.agentStartTime)

    const app = new express()
    app.get('/tps', async (req, res) => {
      await new Promise(resolve => setTimeout(resolve, 10))
      res.send('ok')
    })

    const server = app.listen(TEST_ENV.port, async () => {
      try {
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })

        agentStatsMonitor.send()
        const pAgentStat = await waitForAgentStat(receivedAgentStats)

        t.equal(pAgentStat.getTransaction().getSamplednewcount(), 3, 'PTransaction.sampledNewCount is 3 requests')
        t.ok(pAgentStat.getResponsetime().getMax() > 0, 'PResponseTime.max is greater than 0')
        t.ok(pAgentStat.getCollectinterval() > 0, 'collectInterval is the time since the AgentStatsMonitor was created')
      } catch (error) {
        t.fail(error.stack)
      } finally {
        agentStatsMonitor.shutdown()
        server.close(() => {
          grpcDataSender.close()
          t.end()
        })
      }
    })
  })
})
