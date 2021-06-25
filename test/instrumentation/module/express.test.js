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
const DefaultAnnotationKey = require('../../../lib/constant/annotation-key').DefaultAnnotationKey
const apiMetaService = require('../../../lib/context/api-meta-service')
const MedthodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'express1'
test(`${testName1} Should record request in basic route`, function (t) {
  agent.bindHttp()

  const testName = testName1

  t.plan(6)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res) => {
    Math.random()
    await util.sleep(3000)
    res.send('ok get')

    const trace = agent.traceContext.currentTraceObject()
    t.equal(trace.span.annotations[0].key, DefaultAnnotationKey.HTTP_PARAM.name, 'HTTP param key match')
    t.equal(trace.span.annotations[0].value.stringValue, 'api=test&test1=test', 'HTTP param value match')

    const builder = new MethodDescriptorBuilder('express', 'app.get()')
    const spanEvent = trace.storage.storage[0]

  })

  app.get('/express2', async (req, res) => {
    res.send('ok get')
  })

  app.post(PATH, (req, res) => {
    res.send('ok post')

    const trace = agent.traceContext.currentTraceObject()
    t.false(trace.span.annotations[0], 'HTTP param undefined case')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH) + '?api=test&test1=test')
    t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.info(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

/*
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
      await axios.get('http://dummy.restapiexample.com/api/v1/employees')
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

class MyError extends Error {
  constructor(message) {
    super(message)
    this.name = 'MyError'
  }
}
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
    res.send('hello')
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

  t.plan(2)

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
    res.send('ok router1')
  })
  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

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
}) */