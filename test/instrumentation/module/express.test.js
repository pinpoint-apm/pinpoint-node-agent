/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const semver = require('semver')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const DisableTrace = require('../../../lib/context/disable-trace')
const http = require('http')
const https = require('https')
const { getTransactionId, getDisabledId } = require('../../../lib/context/trace/id-generator')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const { beforeSpecificOne, StatOnlyFunctionalTestableDataSource, DataSourceCallCountable } = require('../../../test/client/grpc-fixture')
const { UriStatsSnapshot } = require('../../../lib/metric/uri-stats-snapshot')
const { UriStatsInfo } = require('../../../lib/metric/uri-stats-info-builder')
const { ConfigBuilder } = require('../../../lib/config-builder')
const { getUriStatsRepository } = require('../../../lib/metric/uri-stats')
const { UriStatsMonitor } = require('../../../lib/metric/uri-stats-monitor')
const Scheduler = require('../../../lib/utils/scheduler')

const TEST_ENV = {
  host: 'localhost', port: 5006
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'express1'
test(`${testName1} Should record request in basic route`, function (t) {
  agent.bindHttp()

  const testName = testName1

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res) => {
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
      t.equal(trace.spanBuilder.annotations[0].value, 'api=test&test1=test', 'HTTP param value match')
      t.equal(trace.spanBuilder.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
      t.equal(trace.spanBuilder.annotations[1].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
  })


  app.post(PATH, (req, res) => {
    res.send('ok post')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, '/express1 HTTP STATUS CODE in annotation zero')
      t.equal(trace.spanBuilder.annotations[0].value, 200, '/express1 HTTP STATUS CODE value in annotation zero')

      let actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
    })
  })

  app.get('/express2', async (req, res) => {
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
  })

  let errorOrder = 0
  let pathSymbol

  const express3Symbol = Symbol('express3')
  app.get('/express3', (req, res, next) => {
    errorOrder++
    pathSymbol = express3Symbol
    throw new Error('error case')
  })

  const express4Symbol = Symbol('express4')
  app.get('/express4', (req, res, next) => {
    errorOrder++
    pathSymbol = express4Symbol
    next(new Error('error case'))
  })

  app.use(function (err, req, res, next) {
    if (pathSymbol == express3Symbol) {
      t.equal(errorOrder, 1, 'express3 error order')
    }
    if (pathSymbol === express4Symbol) {
      t.equal(errorOrder, 2, 'express4 error order')
    }

    agent.callbackTraceClose((trace) => {
      if (errorOrder == 1) {
        throwHandleTest(trace, t)
      } else if (errorOrder == 2) {
        nextErrorHandleTest(trace, t)
      }
    })

    res.status(500).send('Something broke!')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH) + '?api=test&test1=test')
    t.equal(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.equal(result2.status, 200)

    const result3 = await axios.get(getServerUrl('/express2'))
    t.equal(result3.status, 200)

    try {
      await axios.get(getServerUrl('/express3'))
    } catch (error) {
      t.equal(error.response.status, 500)
    }

    try {
      await axios.get(getServerUrl('/express4'))
    } catch (error) {
      t.equal(error.response.status, 500, 'axios.get(getServerUrl(/express4))')
    }

    t.end()
    server.close()
  })
})

function throwHandleTest(trace, t) {
  t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), '/express3 HTTP_STATUS_CODE annotationKey matching')
  t.equal(trace.spanBuilder.annotations[0].value, 500, '/express3 HTTP_STATUS_CODE value matching')

  t.equal(trace.spanBuilder.traceRoot.getShared().getErrorCode(), 1, 'traceRoot errorCode should be 1')

  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.spanBuilder.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualMethodDescriptor.apiDescriptor.startsWith('Router.get'), 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.spanBuilder.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualErrorMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), trace.spanBuilder.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), trace.spanBuilder.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStarttime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), trace.spanBuilder.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), trace.spanBuilder.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate NULL')

  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  const actualSpanEventError = trace.spanBuilder.spanEventList[1].exception
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

function nextErrorHandleTest(trace, t) {
  t.equal(trace.spanBuilder.traceRoot.getShared().getErrorCode(), 1, 'traceRoot errorCode should be 1')

  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.spanBuilder.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.spanBuilder.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualErrorMethodDescriptor.apiDescriptor.startsWith('Router.use'), 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), trace.spanBuilder.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), trace.spanBuilder.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStarttime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), trace.spanBuilder.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), trace.spanBuilder.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate NULL')

  const actualSpanEventError = trace.spanBuilder.spanEventList[1].exception
  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

const testName2 = 'express2'
test(`[${testName2}] Should record request in express.Router`, function (t) {
  agent.bindHttpWithCallSite()

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
    t.ok(result1.status, 200)

    const result2 = await axios.get(getServerUrl(`/express.router2${PATH}`), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.ok(result2.status, 200)

    server.close()
  })
})

const testName3 = 'express3'
test(`${testName3} Should record request taking more than 2 sec`, function (t) {
  agent.bindHttpWithCallSite()

  const testName = testName3

  t.plan(1)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res) => {
    // slow outgoing call
    try {
      await axios.get('https://www.naver.com', { httpsAgent: new https.Agent({ keepAlive: false }) })
    } catch (error) {
      log.error(error)
    }
    res.send('hello')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 200)
    server.close()
  })
})

const testName4 = 'express4'
test(`${testName4} Should record internal error in express.test.js`, function (t) {
  agent.bindHttp()

  const testName = testName4

  t.plan(1)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res, next) => {
    console.log('[app] before ')
    try {
      const foo = null
      const bar = foo.noValue
    } catch (e) {
      next(e)
    }
  })
  app.use((error, req, res, next) => {
    console.log('[app] error handler')
    res.json({ message: error.message })
    res.status = 500
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 500)
    server.close()
  })
})

const testName5 = 'express5'
test(`${testName5} Should record middleware`, function (t) {
  agent.bindHttp()

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

  app.get(PATH, (req, res) => {
    agent.callbackTraceClose((trace) => {
      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[2]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
      t.equal(spanEvent.sequence, 2, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')

      actualBuilder = new MethodDescriptorBuilder('use')
        .setClassName('Router')
      const actualMiddleware1MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      spanEvent = trace.spanBuilder.spanEventList[1]
      t.equal(actualMiddleware1MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMiddleware1MethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
      t.equal(actualMiddleware1MethodDescriptor.className, 'Router', 'className')
      t.equal(actualMiddleware1MethodDescriptor.functionName, 'use', 'functionName')
      t.equal(spanEvent.sequence, 1, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')

      actualBuilder = new MethodDescriptorBuilder('use')
        .setClassName('Router')
      const actualMiddleware2MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMiddleware2MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMiddleware2MethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
      t.equal(actualMiddleware2MethodDescriptor.className, 'Router', 'className')
      t.equal(actualMiddleware2MethodDescriptor.methodName, 'use', 'methodName')
      t.equal(spanEvent.sequence, 0, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')
    })

    res.send('ok router1')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.ok(result1.status, 200)

    t.end()
    server.close()
  })
})

const testName6 = 'express6'
test(`${testName6} Should record each http method`, function (t) {
  agent.bindHttpWithCallSite()

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
    t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    const result3 = await axios.put(getServerUrl(PATH))
    t.ok(result3.status, 200)

    const result4 = await axios.patch(getServerUrl(PATH))
    t.ok(result4.status, 200)

    const result5 = await axios.delete(getServerUrl(PATH))
    t.ok(result5.status, 200)

    server.close()
  })
})

test('semver test', (t) => {
  t.false(semver.satisfies('5.0.0', '^4.0.0'), 'express version')
  t.end()
})

test('express version check', (t) => {
  const hook = require('../../../lib/instrumentation/module/express')
  const expected = { name: 'module' }
  let actual = hook(agent, '5.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0 test')

  actual = hook(agent, '5.0.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0.0 test')
  t.end()
})

test('express without callSite', (t) => {
  agent.bindHttp()

  const app = new express()

  app.get('/express1', async (req, res) => {
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
      t.equal(trace.spanBuilder.annotations[0].value, 'api=test&test1=test', 'HTTP param value match')
      t.equal(trace.spanBuilder.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
      t.equal(trace.spanBuilder.annotations[1].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
  })


  app.post('/express1', (req, res) => {
    res.send('ok post')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, '/express1 HTTP STATUS CODE in annotation zero')
      t.equal(trace.spanBuilder.annotations[0].value, 200, '/express1 HTTP STATUS CODE value in annotation zero')

      let actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
    })
  })

  app.get('/express2', async (req, res) => {
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
  })

  let errorOrder = 0
  let pathSymbol

  const express3Symbol = Symbol('express3')
  app.get('/express3', (req, res, next) => {
    errorOrder++
    pathSymbol = express3Symbol
    throw new Error('error case')
  })

  const express4Symbol = Symbol('express4')
  app.get('/express4', (req, res, next) => {
    errorOrder++
    pathSymbol = express4Symbol
    next(new Error('error case'))
  })

  app.use(function (err, req, res, next) {
    if (pathSymbol == express3Symbol) {
      t.equal(errorOrder, 1, 'express3 error order')
    }
    if (pathSymbol === express4Symbol) {
      t.equal(errorOrder, 2, 'express4 error order')
    }

    agent.callbackTraceClose((trace) => {
      if (errorOrder == 1) {
        throwHandleTestWithoutCallSite(trace, t)
      } else if (errorOrder == 2) {
        nextErrorHandleTestWithoutCallSite(trace, t)
      }
    })

    res.status(500).send('Something broke!')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl('/express1') + '?api=test&test1=test')
    t.equal(result1.status, 200)

    const result2 = await axios.post(getServerUrl('/express1'))
    t.equal(result2.status, 200)

    const result3 = await axios.get(getServerUrl('/express2'))
    t.equal(result3.status, 200)

    try {
      await axios.get(getServerUrl('/express3'))
    } catch (error) {
      t.equal(error.response.status, 500)
    }

    try {
      await axios.get(getServerUrl('/express4'))
    } catch (error) {
      t.equal(error.response.status, 500, 'axios.get(getServerUrl(/express4))')
    }

    t.end()
    server.close()
  })
})

function throwHandleTestWithoutCallSite(trace, t) {
  t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), '/express3 HTTP_STATUS_CODE annotationKey matching')
  t.equal(trace.spanBuilder.annotations[0].value, 500, '/express3 HTTP_STATUS_CODE value matching')

  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.spanBuilder.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.spanBuilder.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualErrorMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
  const actualTransansactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransansactionId.getAgentid(), trace.spanBuilder.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransansactionId.getAgentid()}`)
  t.equal(actualTransansactionId.getAgentstarttime(), trace.spanBuilder.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStartTime ${actualTransansactionId.getAgentstarttime()}`)
  t.equal(actualTransansactionId.getSequence(), trace.spanBuilder.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransansactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), trace.spanBuilder.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate NULL')

  const actualSpanEventError = trace.spanBuilder.spanEventList[1].exception
  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

function nextErrorHandleTestWithoutCallSite(trace, t) {
  let actualBuilder = new MethodDescriptorBuilder('get')
    .setClassName('Router')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.spanBuilder.spanEventList[0]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, 'Router', 'className')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder('use')
    .setClassName('Router')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.spanBuilder.spanEventList[1]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.equal(actualErrorMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(/express\.test\.js:\d+:\d+$/.test(spanEvent.exceptionInfo.stringValue), 'error case')

  const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
  const actualTransactionId = actualExceptionMetaData.getTransactionid()
  t.equal(actualTransactionId.getAgentid(), trace.spanBuilder.traceRoot.getTraceId().getAgentId(), `ExceptionMetaData transactionId agentId ${actualTransactionId.getAgentid()}`)
  t.equal(actualTransactionId.getAgentstarttime(), trace.spanBuilder.traceRoot.getTraceId().getAgentStartTime(), `ExceptionMetaData transactionId agentStartTime ${actualTransactionId.getAgentstarttime()}`)
  t.equal(actualTransactionId.getSequence(), trace.spanBuilder.traceRoot.getTraceId().getTransactionId(), `ExceptionMetaData transactionId sequence ${actualTransactionId.getSequence()}`)
  t.equal(actualExceptionMetaData.getSpanid(), trace.spanBuilder.traceRoot.getTraceId().getSpanId(), `ExceptionMetaData spanId ${actualExceptionMetaData.getSpanid()}`)
  t.equal(actualExceptionMetaData.getUritemplate(), 'NULL', 'ExceptionMetaData uriTemplate NULL')

  const actualSpanEventError = trace.spanBuilder.spanEventList[1].exception
  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData exceptions length 1')
  t.equal(actualExceptions[0].getExceptionclassname(), actualSpanEventError.errorClassName, `ExceptionMetaData exception class name ${actualSpanEventError.errorClassName}`)
  t.equal(actualExceptions[0].getExceptionmessage(), actualSpanEventError.errorMessage, `ExceptionMetaData exception message ${actualSpanEventError.errorMessage}`)
  t.equal(actualExceptions[0].getStarttime(), actualSpanEventError.startTime, `ExceptionMetaData exception start time ${actualSpanEventError.startTime}`)
  t.equal(actualExceptions[0].getExceptionid(), actualSpanEventError.exceptionId, `ExceptionMetaData exception id ${actualSpanEventError.exceptionId}`)
  t.equal(actualExceptions[0].getExceptiondepth(), actualSpanEventError.exceptionDepth, `ExceptionMetaData exception depth ${actualSpanEventError.exceptionDepth}`)
}

test('incoming request by Disable Trace requests', (t) => {
  agent.bindHttp({ 'sampling': { 'rate': 3 } })
  let actualTraceIdTransactionId = 0
  let actualRequestCount = 0

  const app = new express()
  const rootPathTraces = []
  app.get('/', async (req, res) => {
    actualRequestCount++
    const trace = agent.currentTraceObject()
    const traceRoot = trace.getTraceRoot()
    actualTraceIdTransactionId = traceRoot.transactionId

    if (actualRequestCount == 1 || actualRequestCount == 4) {
      t.equal('' + (getTransactionId().sequence - 1), actualTraceIdTransactionId, `traceRoot.transactionId equals transactionIdGenerator.sequence ${traceRoot.transactionId}`)
    }

    const result = await axios.get(getServerUrl('/api'), {
      timeout: 10000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'api request status code is 200')
    t.equal(result.data, 'ok /api get', 'api request data is ok /api get')
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      if (actualRequestCount == 1) {
        t.equal(actualTraceIdTransactionId, trace.getTraceRoot().transactionId, 'transaction id sequence equals transactionIdGenerator.sequence')
      } else if (actualRequestCount == 4) {
        t.equal(actualTraceIdTransactionId, trace.getTraceRoot().transactionId, 'transaction id sequence equals transactionIdGenerator.sequence')
      } else {
        t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
        t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'DisableTrace transaction no updated transactionIdGenerator.sequence')
      }
      rootPathTraces.push(trace)
    })
  })

  const apiRequests = []
  const apiPathTraces = []
  app.get('/api', async (req, res) => {
    apiRequests.push(req)

    const result = await axios.get(getServerUrl('/api2'), {
      timeout: 10000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'api2 request status code is 200')
    t.equal(result.data, 'ok /api2 get', 'api request data is ok /api2 get')
    res.send('ok /api get')

    agent.callbackTraceClose((trace) => {
      if (actualRequestCount == 1 || actualRequestCount == 4) {
        t.equal(actualTraceIdTransactionId, trace.getTraceId().transactionId, 'API transaction id sequence equals transactionIdGenerator.sequence')
      } else {
        t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
        t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'API DisableTrace transaction no updated transactionIdGenerator.sequence')
      }
      apiPathTraces.push(trace)
    })
  })

  const apiRequests2 = []
  const apiPathTraces2 = []
  app.get('/api2', async (req, res) => {
    apiRequests2.push(req)
    res.send('ok /api2 get')

    agent.callbackTraceClose((trace) => {
      if (actualRequestCount == 1 || actualRequestCount == 4) {
        t.equal(actualTraceIdTransactionId, trace.getTraceId().transactionId, 'API transaction id sequence equals transactionIdGenerator.sequence')
      } else {
        t.true(trace instanceof DisableTrace, `trace is DisableTrace actualRequestCount=${actualRequestCount}`)
        t.equal(actualTraceIdTransactionId, '' + (getDisabledId().sequence + 5), 'API DisableTrace transaction no updated transactionIdGenerator.sequence')
      }
      apiPathTraces2.push(trace)
    })
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl('/'), {
      timeout: 20000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.status, 200, 'first / request status code is 200')

    let actualTrace = rootPathTraces[0]
    t.equal(actualTrace.spanBuilder.rpc, '/', 'HTTP Request URI')
    t.equal(actualTrace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
    t.equal(actualTrace.spanBuilder.annotations[0].value, 200, 'response status is 200')

    let actualApiTrace = apiPathTraces[0]
    t.equal(actualTrace.spanBuilder.spanId, actualApiTrace.spanBuilder.parentSpanId, 'parent span id equals to root span id')
    t.equal(actualApiTrace.spanBuilder.rpc, '/api', 'HTTP Request URI')
    t.equal(actualApiTrace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
    t.equal(actualApiTrace.spanBuilder.annotations[0].value, 200, 'response status is 200')

    let actualApiRequest = apiRequests[0]
    t.equal(actualApiRequest.url, '/api', 'api request url is /api')
    t.equal(actualApiRequest.headers['pinpoint-host'], actualApiTrace.spanBuilder.endPoint, 'api request pinpoint-host header is localhost:5006')
    t.equal(actualApiRequest.headers['pinpoint-flags'], '0', 'api request pinpoint-flags header is 0')
    t.equal(actualApiRequest.headers['pinpoint-sampled'], undefined, 'api request pinpoint-sampled header is s0')
    t.equal(actualApiRequest.headers['pinpoint-pappname'], agent.config.applicationName, 'pinpoint-pappname header is config.applicationName')
    t.equal(actualApiRequest.headers['pinpoint-papptype'], String(agent.config.applicationServiceType), 'pinpoint-papptype header is config.applicationServiceType')
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

  agent.bindHttp()
  const app = new express()
  const PATH = '/users/:userId/books/:bookId'

  app.get(PATH, (req, res) => {
    const { userId, bookId } = req.params
    res.send('ok pattern')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.rpc, `/users/${userId}/books/${bookId}`, 'rpc should capture concrete request path')
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code annotation key')
      t.equal(trace.spanBuilder.annotations[0].value, 200, 'HTTP status code is 200')
      t.equal(trace.spanBuilder.uriTemplate, PATH, 'uriTemplate should capture pattern route')
      t.equal(trace.spanBuilder.httpMethod, 'GET', 'httpMethod is GET')

      const md = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router'))
      const spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(md.apiDescriptor, 'Router.get', 'method descriptor uses Router.get')
      t.equal(md.apiId, spanEvent.apiId, 'apiId matches span event')

      server.close()
    })
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/users/42/books/abc'))
    t.equal(result.status, 200, 'pattern route responds 200')
  })
})

test('express should skip uri stats when isUriStatsEnabled is false', (t) => {
  t.plan(4)

  agent.bindHttp({
    "features": {
      "uriStats": undefined
    }
  })

  const app = new express()
  const PATH = '/uri-stats-disabled/:orderId'

  let server
  app.get(PATH, (req, res) => {
    res.send('ok uri off')
    agent.callbackTraceClose((trace) => {
      t.notOk(trace.spanBuilder.uriTemplate, 'uriTemplate should not be recorded when uri stats disabled')
      t.notOk(trace.spanBuilder.httpMethod, 'httpMethod should not be recorded when uri stats disabled')
      server.close()
    })
  })

  server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-disabled/123'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri off', 'response data is ok uri off')
  })
})

test('express should keep uriTemplate but skip httpMethod when isUriStatsHttpMethodEnabled is false', (t) => {
  t.plan(5)

  agent.bindHttp({
    "features": {
      "uriStats": {
        "httpMethod": false
      }
    }
  })

  const app = new express()
  const PATH = '/uri-stats-method-disabled/:orderId'

  let server
  app.get(PATH, (req, res) => {
    res.send('ok uri method off')
    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.uriTemplate, PATH, 'uriTemplate recorded when uri stats enabled')
      t.notOk(trace.spanBuilder.httpMethod, 'httpMethod not recorded when httpMethod flag disabled')
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'status code annotation exists')
      server.close()
    })
  })

  server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-method-disabled/999'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri method off', 'response data is ok uri method off')
  })
})

test('Should aggregate URI stats in UriStatsRepository', function (t) {
  agent.bindHttp()

  const { getUriStatsRepository } = require('../../../lib/metric/uri-stats')
  const { UriStatsRepository } = require('../../../lib/metric/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats'
  const app = new express()

  app.get(PATH, (req, res) => {
    res.send('ok stats')

    agent.callbackTraceClose((trace) => {
      const repository = getUriStatsRepository()

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

      server.close()
      t.end()
    })
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH))
    } catch (e) {
      t.fail(e)
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats without HTTP method when disabled in config', function (t) {
  agent.bindHttp({
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { getUriStatsRepository } = require('../../../lib/metric/uri-stats')
  const { UriStatsRepository } = require('../../../lib/metric/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/no-method'
  const app = new express()

  app.get(PATH, (req, res) => {
    res.send('ok stats no method')

    agent.callbackTraceClose((trace) => {
      const repository = getUriStatsRepository()

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

      server.close()
      t.end()
    })
  })

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH))
    } catch (e) {
      t.fail(e)
      server.close()
      t.end()
    }
  })
})

test('sendStat with UriStatsSnapshot', (t) => {
  const collectorServer = new grpc.Server()
  let assertAgentStat

  collectorServer.addService(services.StatService, {
    sendAgentStat: (call) => {
      call.on('data', (data) => {
        assertAgentStat?.(data)
      })
    }
  })

  collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, StatOnlyFunctionalTestableDataSource)
    const baseTimestamp = Date.now()
    const snapshot = new UriStatsSnapshot(baseTimestamp, 10)
    snapshot.add(new UriStatsInfo('/foo', true, 0, 50))
    snapshot.add(new UriStatsInfo('/foo', true, 0, 400))
    snapshot.add(new UriStatsInfo('/foo', false, 0, 900))
    snapshot.add(new UriStatsInfo('/bar', true, 0, 50))

    assertAgentStat = (data) => {
      t.ok(data, 'Should receive data')
      const agentUriStat = data.getAgenturistat()
      t.ok(agentUriStat, 'Should have agentUriStat')
      t.equal(agentUriStat.getBucketversion(), 0, 'Bucket version should be 0')

      const eachList = agentUriStat.getEachuristatList()
      const byUri = Object.fromEntries(eachList.map(each => [each.getUri(), each]))

      const foo = byUri['/foo']
      t.ok(foo, 'foo entry exists')
      t.equal(foo.getTimestamp(), baseTimestamp, 'foo timestamp')
      const fooTotal = foo.getTotalhistogram()
      t.equal(fooTotal.getTotal(), 1350, 'foo total sum')
      t.equal(fooTotal.getMax(), 900, 'foo total max')
      t.deepEqual(fooTotal.getHistogramList(), [1, 0, 1, 1, 0, 0, 0, 0], 'foo total buckets')
      const fooFailed = foo.getFailedhistogram()
      t.equal(fooFailed.getTotal(), 900, 'foo failed sum')
      t.equal(fooFailed.getMax(), 900, 'foo failed max')
      t.deepEqual(fooFailed.getHistogramList(), [0, 0, 0, 1, 0, 0, 0, 0], 'foo failed buckets')

      const bar = byUri['/bar']
      t.ok(bar, 'bar entry exists')
      t.deepEqual(bar.getTotalhistogram().getHistogramList(), [1, 0, 0, 0, 0, 0, 0, 0], 'bar total buckets')

      collectorServer.forceShutdown()
      grpcDataSender.close()
      t.end()
    }

    grpcDataSender.sendStat(snapshot)
  })
})

class SpanAndStatDataSource extends DataSourceCallCountable {
  constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
    config = Object.assign({}, config, {
      sendSpan: true,
      sendSpanChunk: true,
      sendStat: true,
    })
    config = new ConfigBuilder(config).build()
    super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
  }

  send(data) {
    if (data && typeof data.isUriStatsSnapshot === 'function' && data.isUriStatsSnapshot()) {
      this.sendStat(data)
    }
  }
}

test('Functional Test: SendSpan with success and failure', (t) => {
  const collectorServer = new grpc.Server()
  const receivedSpans = []
  const receivedStats = []

  collectorServer.addService(services.SpanService, {
    sendSpan: (call) => {
      call.on('data', (spanMessage) => {
        receivedSpans.push(spanMessage)
      })
      call.on('end', () => {
        call.end()
      })
    }
  })

  collectorServer.addService(services.StatService, {
    sendAgentStat: (call) => {
      call.on('data', (statMessage) => {
        receivedStats.push(statMessage)
      })
      call.on('end', () => {
        call.end()
      })
    }
  })

  collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
    const grpcDataSender = beforeSpecificOne(port, SpanAndStatDataSource)
    agent.bindHttp(grpcDataSender)

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

      const repository = getUriStatsRepository()
      repository.timeWindow = 1000
      const monitor = new UriStatsMonitor(grpcDataSender, repository)
      monitor.scheduler = new Scheduler(1000)
      monitor.start()

      // Wait for spans (Total delay ~2.3s + overhead)
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
        collectorServer.forceShutdown()
        grpcDataSender.close()
        t.end()
      }, 5000)
    })
  })
})