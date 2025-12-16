/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const agent = require('../../support/agent-singleton-mock')
const Koa = require('koa')
const Router = require('koa-router')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const http = require('http')
const https = require('https')


const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}

const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'koa-router1'
test(`${testName1} Should record request in basic route koa.test.js`, function (t) {
  agent.bindHttp()
  const testName = testName1
  const PATH = `/${testName}`
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx, next) => {
    ctx.body = 'ok. get'

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code')
      t.equal(trace.spanBuilder.annotations[0].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(spanEvent.annotations[0].key, -1, 'parameter')
      t.equal(spanEvent.annotations[0].value, '/koa-router1', 'parameter value matching')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith('Router.get'), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
      t.true(actualMethodDescriptor.location.length > 0, 'location')
    })
  })
  router.post(PATH, async (ctx, next) => {
    ctx.body = 'ok. post'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    t.end()
    server.close()
  })
})

test(`${testName1} Should record request in basic route koa.test.js`, function (t) {
  agent.bindHttp()
  const testName = testName1
  const PATH = `/${testName}`
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx, next) => {
    ctx.body = 'ok. get'

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code')
      t.equal(trace.spanBuilder.annotations[0].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.equal(spanEvent.annotations[0].key, -1, 'parameter')
      t.equal(spanEvent.annotations[0].value, '/koa-router1', 'parameter value matching')
      t.true(actualMethodDescriptor.apiDescriptor.startsWith('Router.get'), 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
  })
  router.post(PATH, async (ctx, next) => {
    ctx.body = 'ok. post'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    t.end()
    server.close()
  })
})

