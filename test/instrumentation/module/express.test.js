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
const express = require('express')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const DisableChildTrace = require('../../../lib/context/trace/disable-child-trace')
const ServiceType = require('../../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const http = require('http')
const https = require('https')
const { once } = require('node:events')
const { getTransactionId, getDisabledId } = require('../../../lib/context/trace/id-generator')
const { TestGrpcDataSenderBuilder, SpanAdaptor, StatAdaptor, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const { UriStatsRepository, UriStatsRepositoryBuilder } = require('../../../lib/metric/uri/uri-stats-repository')
const { UriStatsMonitor } = require('../../../lib/metric/uri/uri-stats-monitor')
const DateNow = require('../../../lib/support/date-now')
const RecordingDataSender = require('../../support/recording-data-sender')
const TraceContext = require('../../../lib/context/trace-context')
const SpanEventRecorder = require('../../../lib/context/trace/span-event-recorder')
const SpanRecorder = require('../../../lib/context/trace/span-recorder')
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
  t.equal(spanEvent.depth, 1, 'the error handler is a sibling of Router.get that threw')
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
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), 'Error', 'ExceptionMetaData exception class name Error')
  t.equal(actualExceptions[0].getExceptionmessage(), 'error case', 'ExceptionMetaData exception message error case')
  t.equal(actualExceptions[0].getExceptiondepth(), 0, 'ExceptionMetaData exception depth 0')
  t.equal(actualExceptions[0].getExceptionid(), exceptionChainId(span.spanEventList[1]), 'the Router.use span event points to the ExceptionMetaData exception')
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
  t.equal(spanEvent.depth, 1, 'the error handler is a sibling of Router.get that called next(error)')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = dataSender.findExceptionMetaData(span.traceRoot).valueOfProtocolBuffer()
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), span.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), span.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStarttime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), span.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), span.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), '/express4', 'ExceptionMetaData uriTemplate /express4')

  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), 'Error', 'ExceptionMetaData exception class name Error')
  t.equal(actualExceptions[0].getExceptionmessage(), 'error case', 'ExceptionMetaData exception message error case')
  t.equal(actualExceptions[0].getExceptiondepth(), 0, 'ExceptionMetaData exception depth 0')
  t.equal(actualExceptions[0].getExceptionid(), exceptionChainId(span.spanEventList[1]), 'the Router.use span event points to the ExceptionMetaData exception')
}

function unhandledExceptionStatsFrameTest(span, dataSender, t) {
  const actualExceptionMetaData = dataSender.findExceptionMetaData(span.traceRoot)?.valueOfProtocolBuffer()
  t.ok(actualExceptionMetaData, 'ExceptionMetaData should be sent')

  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')

  const actualException = actualExceptions[0]
  t.equal(actualException.getExceptionmessage(), 'Pinpoint unhandled exception test route', 'ExceptionMetaData exception message is the message of the error')
  t.equal(actualException.getExceptionid(), exceptionChainId(span.spanEventList[1]), 'the span event of the error points to the ExceptionMetaData exception')

  const stackTraceElements = actualException.getStacktraceelementList()
  t.true(/express\.test\.js$/.test(stackTraceElements[0].getFilename()), 'the first stack trace element is the route that made the error')
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
      t.true(trace instanceof DisableChildTrace, `the handler of an unsampled request runs in a DisableChildTrace actualRequestCount=${actualRequestCount}`)
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
      t.true(trace instanceof DisableChildTrace, `the handler of an unsampled request runs in a DisableChildTrace actualRequestCount=${actualRequestCount}`)
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
      t.true(trace instanceof DisableChildTrace, `the handler of an unsampled request runs in a DisableChildTrace actualRequestCount=${actualRequestCount}`)
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
    t.true(actualTrace instanceof DisableChildTrace, 'the second request is unsampled')

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
    t.true(actualTrace instanceof DisableChildTrace, 'the third request is unsampled')

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

test('Functional Test: requestExceptionMetaData should deliver converted exception stack for /exception/unhandled', async (t) => {
  const metadataAdaptor = new MetadataAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(metadataAdaptor)
    .addAdaptor(new SpanAdaptor())
    .build()
  t.teardown(() => {
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  let traceRoot
  const app = new express()
  app.get('/exception/unhandled', function (req, res, next) {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    const error = new Error('Pinpoint unhandled exception test route')
    error.status = 500
    next(error)
  })
  app.use(function (err, req, res, next) {
    res.status(500).send('Something broke!')
  })
  const server = app.listen(0)
  await new Promise(resolve => server.on('listening', resolve))
  const response = await axios.get(`http://localhost:${server.address().port}/exception/unhandled`, {
    validateStatus: () => true,
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false }),
  })
  server.close()
  t.equal(response.status, 500, 'route should return 500')

  const exceptionMetaData = await metadataAdaptor.exceptionMetaData(traceRoot)
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
    'express-layer-interceptor.js.<anonymous> (<workspace>/lib/instrumentation/module/express/express-layer-interceptor.js:<line>)',
  ].join('\n')

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const workspacePath = process.cwd().replace(/\\/g, '/')
  const normalizeStackTrace = (stackTrace) => {
    return stackTrace
      .replace(/\\/g, '/')
      .replace(new RegExp(escapeRegExp(workspacePath), 'g'), '<workspace>')
      .replace(/express\.test\.js:\d+/g, 'express.test.js:<line>')
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
  t.end()
})

test('Functional Test: requestExceptionMetaData should deliver error.cause chain', async (t) => {
  const metadataAdaptor = new MetadataAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(metadataAdaptor)
    .addAdaptor(new SpanAdaptor())
    .build()
  t.teardown(() => {
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  let traceRoot
  const app = new express()
  app.get('/exception/cause-chain', function (req, res, next) {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    const rootCause = new TypeError('root cause')
    const error = new Error('request failed', { cause: rootCause })
    error.status = 500
    next(error)
  })
  app.use(function (err, req, res, next) {
    res.status(500).send('error')
  })
  const server = app.listen(0)
  await new Promise(resolve => server.on('listening', resolve))
  const response = await axios.get(`http://localhost:${server.address().port}/exception/cause-chain`, {
    validateStatus: () => true,
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false }),
  })
  server.close()
  t.equal(response.status, 500, 'route should return 500')

  const exceptionMetaData = await metadataAdaptor.exceptionMetaData(traceRoot)
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
  t.end()
})

test('Functional Test: SendSpan with success and failure', (t) => {
  const traceRoots = []

  const spanAdaptor = new SpanAdaptor()
  const statAdaptor = new StatAdaptor()
  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(spanAdaptor).addAdaptor(statAdaptor).addAdaptor(new MetadataAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

    const app = new express()
    const successPath = '/functional/success'
    const failPath = '/functional/fail'

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    app.get(successPath, async function (req, res) {
      traceRoots.push(agent.currentTraceObject().getTraceRoot())
      if (req.query.delay) {
        await sleep(parseInt(req.query.delay))
      }
      res.send('ok')
    })
    app.get(failPath, async function (req, res, next) {
      traceRoots.push(agent.currentTraceObject().getTraceRoot())
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
      const monitor = new UriStatsMonitor(grpcDataSender.toDataSender(), repository)
      DateNow.setOffset(repository.getTimeWindow())
      const snapshots = monitor.run()
      DateNow.reset()
      const uriStats = await Promise.all(snapshots.map(snapshot => statAdaptor.uriStat(snapshot.getBaseTimestamp())))

      const spans = await Promise.all(traceRoots.map(traceRoot => spanAdaptor.span(traceRoot)))
      t.equal(spans.length, 7, 'Should receive 7 spans')

      const successSpan = spans.find(span => span.getAcceptevent().getRpc() === successPath)
      const failSpan = spans.find(span => span.getAcceptevent().getRpc() === failPath)

      t.ok(successSpan, 'Success span found')
      if (successSpan) {
        t.equal(successSpan.getErr(), 0, 'Success span should have err=0')
      }

      t.ok(failSpan, 'Fail span found')
      if (failSpan) {
        t.equal(failSpan.getErr(), 1, 'Fail span should have err=1')

        const spanEvents = failSpan.getSpaneventList()
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

      t.ok(uriStats.length > 0, 'Should receive stats')
      if (uriStats.length > 0) {
        const mergedStats = {}

        uriStats.forEach(statMsg => {
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

      server.close()
      grpcDataSender.close()
      t.end()
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

test('Express: a route handler runs in its own Asynchronous Invocation, so the fetch() calls after each await stay under Router.get', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = new express()
  app.get('/users', async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/users`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only Router.get')
  const routeSpanEvent = span.spanEventList[0]
  t.equal(routeSpanEvent.depth, 1, 'Router.get is at depth 1')

  const handlerSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(handlerSpanEvents.length, 4, 'the Asynchronous Invocation of Router.get has the three fetch() span events')
  const [asyncInvocation, fetchA, fetchB, fetchC] = handlerSpanEvents
  t.equal(asyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get starts with the Asynchronous Invocation')
  t.equal(asyncInvocation.depth, 1, 'the Asynchronous Invocation is at depth 1')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() before the first await')
  t.equal(fetchA.sequence, 1, 'fetch a is sequence 1')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation')
  t.equal(fetchB.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch b is the fetch() after the first await')
  t.equal(fetchB.sequence, 2, 'fetch b is sequence 2')
  t.equal(fetchB.depth, 2, 'fetch b is at depth 2 under the Asynchronous Invocation')
  t.equal(fetchC.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch c is the fetch() after the second await')
  t.equal(fetchC.sequence, 3, 'fetch c is sequence 3')
  t.equal(fetchC.depth, 2, 'fetch c is at depth 2 under the Asynchronous Invocation')
  t.end()
})

test('Express: a fetch() in a setTimeout callback of a route handler stays under Router.get', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = new express()
  app.get('/timer', (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    setTimeout(async () => {
      await (await fetch(targetUrl)).text()
      res.send('ok')
    }, 10)
  })
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/timer`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only Router.get')
  const routeSpanEvent = span.spanEventList[0]

  const handlerSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(handlerSpanEvents.length, 2, 'the Asynchronous Invocation of Router.get has the fetch() span event')
  const [asyncInvocation, fetchA] = handlerSpanEvents
  t.equal(asyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get starts with the Asynchronous Invocation')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() in the setTimeout callback')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation')
  t.end()
})

test('Express: a middleware handler runs in its own Asynchronous Invocation, and the route after its next() stays a sibling', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = new express()
  app.use('/users', async (req, res, next) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 10))
    await (await fetch(targetUrl)).text()
    next()
  })
  app.get('/users', (req, res) => {
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/users`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 2, 'the PSpan has Router.use and Router.get')
  const [middlewareSpanEvent, routeSpanEvent] = span.spanEventList
  t.equal(middlewareSpanEvent.depth, 1, 'Router.use is at depth 1')
  t.equal(routeSpanEvent.depth, 1, 'Router.get after next() is at depth 1 next to Router.use')

  const middlewareSpanEvents = dataSender.findAsyncInvocationSpanEvents(middlewareSpanEvent)
  t.equal(middlewareSpanEvents.length, 2, 'the Asynchronous Invocation of Router.use has the fetch() span event')
  const [middlewareAsyncInvocation, fetchA] = middlewareSpanEvents
  t.equal(middlewareAsyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.use starts with the Asynchronous Invocation')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() after the await of the middleware')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation of Router.use')

  const routeSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(routeSpanEvents.length, 1, 'the Asynchronous Invocation of Router.get has no call')
  t.equal(routeSpanEvents[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get is the Asynchronous Invocation')
  t.end()
})

test('Express: a route of a mounted sub-app runs in the Asynchronous Invocation of the sub-app and records its URI template', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  let traceRoot
  const admin = new express()
  admin.get('/users/:id', async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const app = new express()
  app.use('/admin', admin)
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/admin/users/1`)
  t.equal(response.status, 200, 'the sub-app route responds 200')
  t.equal(await response.text(), 'ok', 'the sub-app route sends its body')
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only the Router.use of the sub-app')
  const subAppSpanEvents = dataSender.findAsyncInvocationSpanEvents(span.spanEventList[0])
  t.equal(subAppSpanEvents[1].apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router')).apiId, 'the Router.get of the sub-app route is in the Asynchronous Invocation of the sub-app')
  t.equal(subAppSpanEvents[1].depth, 2, 'the Router.get of the sub-app route is at depth 2 under that Asynchronous Invocation')
  t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'the URI template of the sub-app route is recorded on the TraceRoot')
  t.equal(span.traceRoot.getEnricher('uriStats.method'), 'GET', 'the HTTP method of the sub-app route is recorded on the TraceRoot')
  t.end()
})

test('Express: a route of a mounted sub-app in an unsampled request records its URI template', async (t) => {
  const agent = new ProcessAgentBuilder({ sampling: { enable: false } }).setDataSender(new RecordingDataSender()).build()

  let traceRoot
  const admin = new express()
  admin.get('/users/:id', async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const app = new express()
  app.use('/admin', admin)
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/admin/users/1`)
  t.equal(response.status, 200, 'the sub-app route responds 200')
  server.close()

  t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'the URI template of the sub-app route is recorded on the TraceRoot of the unsampled request')
  t.end()
})

test('Express: a route responds when the agent fails to record its span event', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const recordApi = SpanEventRecorder.prototype.recordApi
  SpanEventRecorder.prototype.recordApi = function () {
    throw new Error('the agent fails to record the span event')
  }
  t.teardown(() => {
    SpanEventRecorder.prototype.recordApi = recordApi
  })

  let handled = 0
  let traceInHandler
  const app = new express()
  app.get('/agent-error', async (req, res) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})

test('Express: a route responds when the agent fails to make its Asynchronous Invocation', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const continueAsyncContextTraceObject = TraceContext.prototype.continueAsyncContextTraceObject
  TraceContext.prototype.continueAsyncContextTraceObject = function () {
    throw new Error('the agent fails to make the Asynchronous Invocation')
  }
  t.teardown(() => {
    TraceContext.prototype.continueAsyncContextTraceObject = continueAsyncContextTraceObject
  })

  let handled = 0
  let traceInHandler
  const app = new express()
  app.get('/agent-error', async (req, res) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})

test('Express: a route responds when the agent fails to record its URI template', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const recordUriTemplate = SpanRecorder.prototype.recordUriTemplate
  SpanRecorder.prototype.recordUriTemplate = function () {
    throw new Error('the agent fails to record the URI template')
  }
  t.teardown(() => {
    SpanRecorder.prototype.recordUriTemplate = recordUriTemplate
  })

  let handled = 0
  let traceInHandler
  const app = new express()
  app.get('/agent-error', async (req, res) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})

function exceptionChainId(spanEvent) {
  return spanEvent.annotations.find(annotation => annotation.getKey() === annotationKey.EXCEPTION_CHAIN_ID.getCode()).getValue()
}
