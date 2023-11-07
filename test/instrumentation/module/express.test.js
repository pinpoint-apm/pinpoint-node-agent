/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')

const { log, util } = require('../../test-helper')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const annotationKey = require('../../../lib/constant/annotation-key')
const { expected } = require('../../fixtures/instrument-support')
const apiMetaService = require('../../../lib/context/api-meta-service')
const semver = require('semver')
const MethodDescriptorBuilder2 = require('../../../lib/context/method-descriptor-builder2')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
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
      t.equal(trace.span.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
      t.equal(trace.span.annotations[0].value, 'api=test&test1=test', 'HTTP param value match')
      t.equal(trace.span.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
      t.equal(trace.span.annotations[1].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder2(expected('get', 'app.get'))
        .setClassName(expected('app', 'Function'))
        .setLineNumber(34)
        .setFileName('express.test.js')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.span.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.get', 'Function.app.get')), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
      t.equal(actualMethodDescriptor.lineNumber, 34, 'lineNumber')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
      t.true(actualMethodDescriptor.location.length > 0, 'location')
    })
  })


  app.post(PATH, (req, res) => {
    res.send('ok post')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, '/express1 HTTP STATUS CODE in annotation zero')
      t.equal(trace.span.annotations[0].value, 200, '/express1 HTTP STATUS CODE value in annotation zero')
  
      let actualBuilder = new MethodDescriptorBuilder2(expected('post', 'app.post'))
        .setClassName(expected('app', 'Function'))
        .setLineNumber(59)
        .setFileName('express.test.js')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.span.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.post', 'Function.app.post')), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
      t.equal(actualMethodDescriptor.lineNumber, 59, 'lineNumber')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
      t.true(actualMethodDescriptor.location.endsWith('express.test.js'), 'location')
    })
  })

  app.get('/express2', async (req, res) => {
    res.send('ok get')

    agent.callbackTraceClose((trace) => {
      let actualBuilder = new MethodDescriptorBuilder2(expected('get', 'app.get'))
        .setClassName(expected('app', 'Function'))
        .setLineNumber(81)
        .setFileName('express.test.js')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.span.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.get', 'Function.app.get')), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
      t.equal(actualMethodDescriptor.lineNumber, 81, 'lineNumber')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
      t.true(actualMethodDescriptor.location.endsWith('express.test.js'), 'location')
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
  t.equal(trace.span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), '/express3 HTTP_STATUS_CODE annotationKey matching')
  t.equal(trace.span.annotations[0].value, 500, '/express3 HTTP_STATUS_CODE value matching')

  let actualBuilder = new MethodDescriptorBuilder2(expected('get', 'app.get'))
    .setClassName(expected('app', 'Function'))
    .setLineNumber(104)
    .setFileName('express.test.js')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.span.spanEventList[1]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.get', 'Function.app.get')), 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
  t.equal(actualMethodDescriptor.lineNumber, 104, 'lineNumber')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.true(actualMethodDescriptor.location.endsWith('express.test.js'), 'location')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder2('use')
    .setClassName('Router')
    .setLineNumber(117)
    .setFileName('express.test.js')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.span.spanEventList[0]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualErrorMethodDescriptor.apiDescriptor.startsWith('Router.use'), 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.lineNumber, 117, 'lineNumber')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.true(actualErrorMethodDescriptor.location.endsWith('express.test.js'), 'location')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(spanEvent.exceptionInfo.stringValue.endsWith('express.test.js:107:11'), 'error case')
}

function nextErrorHandleTest(trace, t) {
  let actualBuilder = new MethodDescriptorBuilder2(expected('get', 'app.get'))
    .setClassName(expected('app', 'Function'))
    .setLineNumber(111)
    .setFileName('express.test.js')
  const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  let spanEvent = trace.span.spanEventList[1]
  t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.get', 'Function.app.get')), 'apiDescriptor')
  t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
  t.equal(actualMethodDescriptor.lineNumber, 111, 'lineNumber')
  t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
  t.true(actualMethodDescriptor.location.endsWith('express.test.js'), 'location')
  t.equal(spanEvent.sequence, 0, 'sequence')
  t.equal(spanEvent.depth, 1, 'spanEvent.depth')

  actualBuilder = new MethodDescriptorBuilder2('use')
    .setClassName('Router')
    .setLineNumber(117)
    .setFileName('express.test.js')
  const actualErrorMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
  spanEvent = trace.span.spanEventList[0]
  t.equal(actualErrorMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
  t.true(actualErrorMethodDescriptor.apiDescriptor.startsWith('Router.use'), 'apiDescriptor')
  t.equal(actualErrorMethodDescriptor.className, 'Router', 'className')
  t.equal(actualErrorMethodDescriptor.lineNumber, 117, 'lineNumber')
  t.equal(actualErrorMethodDescriptor.methodName, 'use', 'methodName')
  t.true(actualErrorMethodDescriptor.location.endsWith('express.test.js'), 'location')
  t.equal(spanEvent.sequence, 1, 'sequence')
  t.equal(spanEvent.depth, 2, 'spanEvent.depth')
  t.equal(spanEvent.exceptionInfo.intValue, 1, 'error value')
  t.true(spanEvent.exceptionInfo.stringValue.endsWith('express.test.js:114:10'), 'error case')
}

const testName2 = 'express2'
test(`[${testName2}] Should record request in express.Router`, function (t) {
  agent.bindHttp()

  const testName = testName2

  t.plan(3)

  const PATH = '/' + testName
  const app = new express()

  const router1 = express.Router()
  router1.get(PATH, (req, res) => {
    res.send('ok router1')
  })

  const router2 = express.Router()
  router2.get(PATH, async (req, res) => {
    await util.sleep(1000)
    res.send('ok router2')
  })

  app.use('/express.router1', router1)
  app.use('/express.router2', router2)

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(`/express.router1${PATH}`))
    t.ok(result1.status, 200)

    const result2 = await axios.get(getServerUrl(`/express.router2${PATH}`))
    t.ok(result2.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName3 = 'express3'
test(`${testName3} Should record request taking more than 2 sec`, function (t) {
  agent.bindHttp()

  const testName = testName3

  t.plan(2)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res) => {
    // slow outgoing call
    try {
      await axios.get('https://www.naver.com')
    } catch (error) {
      log.error(error)
    }
    res.send('hello')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName4 = 'express4'
test(`${testName4} Should record internal error in express.test.js`, function (t) {
  agent.bindHttp()

  const testName = testName4

  t.plan(2)

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

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

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
    agent.callbackTraceClose((trace) =>{
      let actualBuilder = new MethodDescriptorBuilder2(expected('get', 'app.get'))
        .setClassName(expected('app', 'Function'))
        .setLineNumber(368)
        .setFileName('express.test.js')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.span.spanEventList[2]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith(expected('app.get', 'Function.app.get')), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, expected('app', 'Function'), 'className')
      t.equal(actualMethodDescriptor.lineNumber, 368, 'lineNumber')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
      t.true(actualMethodDescriptor.location.endsWith('express.test.js'), 'location')
      t.equal(spanEvent.sequence, 2, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')
  
      actualBuilder = new MethodDescriptorBuilder2('use')
        .setClassName('Router')
        .setLineNumber(358)
        .setFileName('express.test.js')
      const actualMiddleware1MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      spanEvent = trace.span.spanEventList[1]
      t.equal(actualMiddleware1MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMiddleware1MethodDescriptor.apiDescriptor.startsWith('Router.use'), 'apiDescriptor')
      t.equal(actualMiddleware1MethodDescriptor.className, 'Router', 'className')
      t.equal(actualMiddleware1MethodDescriptor.lineNumber, 358, 'lineNumber')
      t.equal(actualMiddleware1MethodDescriptor.functionName, 'use', 'functionName')
      t.true(actualMiddleware1MethodDescriptor.location.endsWith('express.test.js'), 'location')
      t.equal(spanEvent.sequence, 1, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')
  
      actualBuilder = new MethodDescriptorBuilder2('use')
        .setClassName('Router')
        .setLineNumber(353)
        .setFileName('express.test.js')
      const actualMiddleware2MethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      spanEvent = trace.span.spanEventList[0]
      t.equal(actualMiddleware2MethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMiddleware2MethodDescriptor.apiDescriptor.startsWith('Router.use'), 'apiDescriptor')
      t.equal(actualMiddleware2MethodDescriptor.className, 'Router', 'className')
      t.equal(actualMiddleware2MethodDescriptor.lineNumber, 353, 'lineNumber')
      t.equal(actualMiddleware2MethodDescriptor.methodName, 'use', 'methodName')
      t.true(actualMiddleware2MethodDescriptor.location.endsWith('express.test.js'), 'location')
      t.equal(spanEvent.sequence, 0, 'sequence')
      t.equal(spanEvent.depth, 1, 'spanEvent.depth')
    })

    res.send('ok router1')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    t.end()
    server.close()
  })
})

const testName6 = 'express6'
test(`${testName6} Should record each http method`, function (t) {
  agent.bindHttp()

  const testName = testName6

  t.plan(6)

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

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

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
  let actual = hook(null, '5.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0 test')

  actual = hook(null, '5.0.0', expected)
  t.equal(actual.name, 'module', 'express version 5.0.0 test')
  t.end()
})
