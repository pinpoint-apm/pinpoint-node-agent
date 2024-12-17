/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const agent = require('../../support/agent-singleton-mock')
const express = require('express')
const Koa = require('koa')
const Router = require('koa-router')
const koaBodyParser = require('koa-bodyparser')
const ioRedis = require('ioredis')
const { createClient } = require('redis')
const { RedisContainer } = require('@testcontainers/redis')
const { Wait } = require('testcontainers')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const apiMetaService = require('../../../lib/context/api-meta-service')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../../../lib/context/service-type')
const annotationKey = require('../../../lib/constant/annotation-key')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const { assertTrace } = require('../../fixture')
const https = require('https')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const redisData = {
  name: 'jundol',
  job: 'bon developer',
  salary: 500000000,
}

const testName1 = 'express-redis'
test(`${testName1} should Record the connections between express and redis.`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName1
  const app = new express()
  const client = createClient({ url: container.getConnectionUrl() })
  const PATH = `/${testName}`

  app.use(express.json())
  app.use(function (req, res, next) {
    req.cache = client
    next()
  })

  app.post(PATH, function (req, res, next) {
    req.accepts('application/json')
    var key = req.body.name
    var value = JSON.stringify(req.body)

    let actualNextAsyncId
    let actualSpanId
    req.cache.set(key, value, async function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      const trace = localStorage.getStore()
      axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })
        .then(function (response) {
          const actualHttpCallbackNextAsyncId = actualNextAsyncId
          const actualHttpCallbackSpanChunk = trace.repository.dataSender.findSpanChunk(actualHttpCallbackNextAsyncId)
          t.equal(actualHttpCallbackSpanChunk.traceRoot.getTraceId().getSpanId(), trace.traceRoot.getTraceId().getSpanId(), 'HTTP request callback spanId')
          t.equal(actualHttpCallbackSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'HTTP request callback transactionId')
          t.equal(actualHttpCallbackSpanChunk.localAsyncId.asyncId, actualHttpCallbackNextAsyncId.asyncId, 'HTTP request callback localAsyncId.asyncId')
          t.equal(actualHttpCallbackSpanChunk.localAsyncId.sequence, 1, 'HTTP request callback localAsyncId.sequence')

          let actualSpanEvent = actualHttpCallbackSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 0)
          t.equal(actualSpanEvent.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'HTTP request callback asyncInvocationDescriptor.spanEvent.apiId')
          t.equal(actualSpanEvent.depth, 1, 'HTTP request callback asyncInvocationDescriptor.spanEvent.depth')
          t.equal(actualSpanEvent.sequence, 0, 'HTTP request callback asyncInvocationDescriptor.spanEvent.sequence')
          t.equal(actualSpanEvent.serviceType, ServiceType.async.getCode(), 'HTTP request callback asyncInvocationDescriptor.spanEvent.serviceType')

          actualSpanEvent = actualHttpCallbackSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 1)
          t.equal(actualSpanEvent.apiId, 0, 'HTTP request callback spanEvent.apiId')
          t.equal(actualSpanEvent.depth, 2, 'HTTP request callback spanEvent.depth')
          t.equal(actualSpanEvent.sequence, 1, 'HTTP request callback spanEvent.sequence')
          t.equal(actualSpanEvent.serviceType, ServiceType.asyncHttpClient.getCode(), 'HTTP request callback spanEvent.serviceType')

          let actualAnnotation = actualSpanEvent.annotations[0]
          t.equal(actualAnnotation.key, annotationKey.API.getCode(), 'HTTP request callback spanEvent.annotation[0].key')
          t.equal(actualAnnotation.value, 'GET', 'HTTP request callback spanEvent.annotation[0].value')
          actualAnnotation = actualSpanEvent.annotations[1]
          t.equal(actualAnnotation.key, annotationKey.HTTP_URL.getCode(), 'HTTP request callback spanEvent.annotation[1].key annotationKey.HTTP_URL')
          t.equal(actualAnnotation.value, 'www.naver.com/', 'HTTP request callback spanEvent.annotation[1].value annotationKey.HTTP_URL')
          actualAnnotation = actualSpanEvent.annotations[2]
          t.equal(actualAnnotation.key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP request callback spanEvent.annotation[2].key annotationKey.HTTP_STATUS_CODE')
          t.equal(actualAnnotation.value, 200, 'HTTP request callback spanEvent.annotation[2].value annotationKey.HTTP_STATUS_CODE')
        })
      req.cache.expire(key, 10)

      assertTrace(trace => {
        let actualSpanChunk = trace.repository.dataSender.mockSpanChunks[0]
        t.equal(actualSpanChunk.traceRoot.getTraceId().getSpanId(), trace.traceRoot.getTraceId().getSpanId(), 'spanId')
        t.equal(actualSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'transactionId')
        t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId.asyncId')
        t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence')

        let actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 0)
        t.equal(actualSpanEvent.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId')
        t.equal(actualSpanEvent.depth, 1, 'depth')
        t.equal(actualSpanEvent.sequence, 0, 'sequence')
        t.equal(actualSpanEvent.serviceType, ServiceType.async.getCode(), 'serviceType')

        actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 1)
        t.equal(actualSpanEvent.apiId, 0, 'HTTP request apiId')
        t.equal(actualSpanEvent.depth, 2, 'HTTP request depth')
        t.equal(actualSpanEvent.sequence, 1, 'HTTP request sequence')
        t.equal(actualSpanEvent.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'HTTP request serviceType')

        let actualAnnotation = actualSpanEvent.annotations.find(annotation => annotation.key === annotationKey.API.getCode())
        t.equal(actualAnnotation.value, 'http.request', 'HTTP request annotation value')
        actualNextAsyncId = actualSpanEvent.asyncId

        actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 2)
        let actualBuilder = new MethodDescriptorBuilder('expire')
          .setClassName('RedisClient')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'RedisClient.expire apiId')
        t.equal(actualMethodDescriptor.apiDescriptor, 'RedisClient.expire', 'RedisClient.expire apiDescriptor')
        t.equal(actualMethodDescriptor.className, 'RedisClient', 'RedisClient.expire className')
        t.equal(actualMethodDescriptor.methodName, 'expire', 'RedisClient.expire methodName')
        t.equal(actualSpanEvent.sequence, 2, 'RedisClient.expire actualSpanEvent.sequence')
        t.equal(actualSpanEvent.depth, 2, 'RedisClient.expire actualSpanEvent.depth')
        t.equal(actualSpanEvent.serviceType, 8200, 'RedisClient.expire actualSpanEvent.serviceType')
        t.equal(actualSpanEvent.destinationId, 'Redis', 'RedisClient.expire actualSpanEvent.destinationId')
        t.equal(actualSpanEvent.endPoint, `localhost:${container.getMappedPort(6379)}`, 'RedisClient.expire actualSpanEvent.endPoint')
      })
    })

    assertTrace(trace => {
      let actualBuilder = new MethodDescriptorBuilder('use')
        .setClassName('Router')
      let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let actualSpanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'use', 'methodName')
      t.equal(actualSpanEvent.sequence, 0, 'sequence')
      t.equal(actualSpanEvent.depth, 1, 'depth')
      t.equal(actualSpanEvent.serviceType, 6600, 'serviceType')

      actualBuilder = new MethodDescriptorBuilder('use')
        .setClassName('Router')
      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      actualSpanEvent = trace.spanBuilder.spanEventList[1]
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.use', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'use', 'methodName')
      t.equal(actualSpanEvent.sequence, 1, 'sequence')
      t.equal(actualSpanEvent.depth, 1, 'depth')
      t.equal(actualSpanEvent.serviceType, 6600, 'serviceType')

      actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 2)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
      t.equal(actualSpanEvent.sequence, 2, 'sequence')
      t.equal(actualSpanEvent.depth, 1, 'depth')
      t.equal(actualSpanEvent.serviceType, 6600, 'serviceType')

      actualBuilder = new MethodDescriptorBuilder('set')
        .setClassName('RedisClient')
      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 3)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'RedisClient.set', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'RedisClient', 'className')
      t.equal(actualMethodDescriptor.methodName, 'set', 'methodName')
      t.equal(actualSpanEvent.sequence, 3, 'sequence')
      t.equal(actualSpanEvent.depth, 2, 'depth')
      t.equal(actualSpanEvent.serviceType, 8200, 'serviceType')
      t.equal(actualSpanEvent.destinationId, 'Redis', 'destinationId')
      t.equal(actualSpanEvent.endPoint, `localhost:${container.getMappedPort(6379)}`, 'endPoint')
      actualNextAsyncId = actualSpanEvent.asyncId
      actualSpanId = trace.spanBuilder.traceRoot.getTraceId().getSpanId()
    })
    res.json(value)
  })

  app.get(`${PATH}/:name`, function (req, res, next) {
    var key = req.params.name
    req.cache.get(key, function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      var value = JSON.parse(data)
      res.json(value)
    })
  })
  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })
  const server = app.listen(TEST_ENV.port, async function () {
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    client.quit()
    await container.stop()
    server.close()
    t.end()
  })
})

test(`${testName1} redis callback nested asyncTrace with await HTTP get`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName1
  const app = new express()
  const client = createClient({ url: container.getConnectionUrl() })
  const PATH = `/${testName}`

  app.post(PATH, function (req, res, next) {
    client.set('key', 'value', async function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      try {
        const { data } = await axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })
      } catch (error) {
        console.error(error)
      }
      client.expire('key', 10)
      res.send('ok get')
    })

    agent.callbackTraceClose((trace) => {
      let actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 0)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
      t.equal(actualSpanEvent.sequence, 0, 'sequence')
      t.equal(actualSpanEvent.depth, 1, 'depth')
      t.equal(actualSpanEvent.serviceType, 6600, 'serviceType')

      actualBuilder = new MethodDescriptorBuilder('set')
        .setClassName('RedisClient')
      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 1)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'RedisClient.set', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'RedisClient', 'className')
      t.equal(actualMethodDescriptor.methodName, 'set', 'methodName')
      t.equal(actualSpanEvent.sequence, 1, 'sequence')
      t.equal(actualSpanEvent.depth, 2, 'depth')
      t.equal(actualSpanEvent.serviceType, 8200, 'serviceType')
      t.equal(actualSpanEvent.destinationId, 'Redis', 'destinationId')
      t.equal(actualSpanEvent.endPoint, `localhost:${container.getMappedPort(6379)}`, 'endPoint')
      let actualNextAsyncId = actualSpanEvent.asyncId

      let actualSpanChunk = trace.repository.dataSender.findSpanChunk(actualNextAsyncId)
      t.equal(actualSpanChunk.traceRoot.getTraceId().getSpanId(), trace.spanBuilder.traceRoot.getTraceId().getSpanId(), 'RedisClient.set spanChunk.spanId')
      t.equal(actualSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'RedisClient.set spanChunk.agentId')
      t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'RedisClient.set spanChunk.localAsyncId.asyncId')
      t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'RedisClient.set spanChunk.localAsyncId.sequence')

      actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 0)
      t.equal(actualSpanEvent.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'RedisClient.set spanChunk asyncInvocationDescriptor.spanEvent.apiId')
      t.equal(actualSpanEvent.depth, 1, 'RedisClient.set spanChunk asyncInvocationDescriptor.spanEvent.depth')
      t.equal(actualSpanEvent.sequence, 0, 'RedisClient.set spanChunk asyncInvocationDescriptor.spanEvent.sequence')
      t.equal(actualSpanEvent.serviceType, ServiceType.async.getCode(), 'RedisClient.set spanChunk asyncInvocationDescriptor.spanEvent.serviceType')

      actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 1)
      t.equal(actualSpanEvent.apiId, 0, 'HTTP request apiId')
      t.equal(actualSpanEvent.depth, 2, 'HTTP request depth')
      t.equal(actualSpanEvent.sequence, 1, 'HTTP request sequence')
      t.equal(actualSpanEvent.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'HTTP request serviceType')

      t.equal(actualSpanChunk.spanEventList.length, 2, 'spanEventList.length')
    })
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    client.quit()
    await container.stop()
    server.close()
    t.end()
  })
})


const testName2 = 'express-ioredis'
test(`${testName2} should Record the connections between express and ioredis.`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName2

  const app = new express()
  const redis = new ioRedis(container.getMappedPort(6379), container.getHost())
  const PATH = `/${testName}`

  app.use(express.json())
  app.use(function (req, res, next) {
    req.cache = redis
    next()
  })
  app.post(PATH, function (req, res, next) {
    req.accepts('application/json')
    var key = req.body.name
    var value = JSON.stringify(req.body)
    req.cache.set(key, value, function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      req.cache.expire(key, 10)
      res.json(value)
    })
  })
  app.get(`${PATH}/:name`, function (req, res, next) {
    var key = req.params.name
    req.cache.get(key, function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      var value = JSON.parse(data)
      res.json(value)
    })
  })
  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })
  const server = app.listen(TEST_ENV.port, async function () {
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    redis.quit()
    container.stop()
    server.close()
    t.end()
  })
})

const testName3 = 'koa-redis'
test(`${testName3} should Record the connections between koa and redis.`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName3
  const app = new Koa()
  const router = new Router()
  const client = createClient({ url: container.getConnectionUrl() })

  const PATH = `/${testName}`
  app.use(koaBodyParser())
  router.post(PATH, async function (ctx, next) {
    console.log(ctx.request.body)
    const key = ctx.request.body.name
    const value = JSON.stringify(ctx.request.body)

    client.set(key, value, function (err, data) {
      if (err) {
        console.log(err)
        ctx.body = `error :: ${err}`
        return
      }
      // ctx.req.cache.expire(key, 10)
      ctx.body = JSON.parse(value)
    })
  })

  router.get(`${PATH}/:name`, async (ctx, next) => {
    const key = ctx.params.name

    client.get(key)
    client.get(key)
    client.get(key)

    ctx.body = 'test'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    // const rstPush = await axios.post(getServerUrl(PATH), redisData)
    // t.ok(rstPush.status, 200)

    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    client.quit()
    await container.stop()
    server.close()
    t.end()
  })
})

const testName4 = 'koa-ioredis'
test(`${testName4} should Record the connections between koa and ioredis.`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName4

  const app = new Koa()
  const router = new Router()
  const redis = new ioRedis(container.getMappedPort(6379), container.getHost())

  const PATH = `/${testName}`
  app.use(koaBodyParser())
  router.post(PATH, async function (ctx, next) {
    const key = ctx.request.body.name
    const value = JSON.stringify(ctx.request.body)
    await redis.set(key, value)
    ctx.body = 'test'
  })

  router.get(`${PATH}/:name`, async (ctx, next) => {
    const key = ctx.params.name
    // await Promise.all([
    //   redis.get(key),
    //   redis.get(key),
    //   redis.get(key)
    // ])


    redis.get(key, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
      }
    })

    redis.get(key, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
      }
    })
    redis.get(key, (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
      }
    })

    ctx.body = 'test'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    console.log('Step1.')
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    console.log('Step2.')
    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    redis.quit()
    await container.stop()
    server.close()
    t.end()
  })
})

test(`${testName1} await connections between express and redis.`, async function (t) {
  agent.bindHttp()
  const container = await new RedisContainer()
    .withWaitStrategy(Wait.forAll([
      Wait.forListeningPorts(),
      Wait.forLogMessage("Ready to accept connections")
    ]))
    .start()

  const testName = testName1
  const app = new express()
  const client = createClient({ url: container.getConnectionUrl() })
  const PATH = `/${testName}`

  app.post(PATH, function (req, res, next) {
    const trace = agent.currentTraceObject()
    let traceRoot = trace.getTraceRoot()
    let actualHttpCallbackNextAsyncId
    client.set('key', 'value', async function (err, data) {
      if (err) {
        console.log(err)
        res.send("error " + err)
        return
      }
      assertTrace(async childTrace => {
        let actualSpanChunk = childTrace.repository.dataSender.mockSpanChunks[0]
        let actualNextAsyncId = trace.repository.buffer.find(spanEvent => spanEvent.sequence === 1).asyncId
        t.equal(actualSpanChunk.traceRoot.getTraceId().getSpanId(), traceRoot.getTraceId().getSpanId(), 'spanId')
        t.equal(actualSpanChunk.getTraceRoot(), trace.getTraceRoot(), 'transactionId')
        t.equal(actualSpanChunk.localAsyncId.asyncId, actualNextAsyncId.asyncId, 'localAsyncId.asyncId')
        t.equal(actualSpanChunk.localAsyncId.sequence, 1, 'localAsyncId.sequence')

        let actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 0)
        t.equal(actualSpanEvent.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'apiId')
        t.equal(actualSpanEvent.depth, 1, 'depth')
        t.equal(actualSpanEvent.sequence, 0, 'sequence')
        t.equal(actualSpanEvent.serviceType, ServiceType.async.getCode(), 'serviceType')

        actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 1)
        let actualBuilder = new MethodDescriptorBuilder('expire')
          .setClassName('RedisClient')
        let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
        t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'RedisClient.expire apiId')
        t.equal(actualMethodDescriptor.apiDescriptor, 'RedisClient.expire', 'RedisClient.expire apiDescriptor')
        t.equal(actualMethodDescriptor.className, 'RedisClient', 'RedisClient.expire className')
        t.equal(actualMethodDescriptor.methodName, 'expire', 'RedisClient.expire methodName')
        t.equal(actualSpanEvent.sequence, 1, 'RedisClient.expire actualSpanEvent.sequence')
        t.equal(actualSpanEvent.depth, 2, 'RedisClient.expire actualSpanEvent.depth')
        t.equal(actualSpanEvent.serviceType, 8200, 'RedisClient.expire actualSpanEvent.serviceType')
        t.equal(actualSpanEvent.destinationId, 'Redis', 'RedisClient.expire actualSpanEvent.destinationId')
        t.equal(actualSpanEvent.endPoint, `localhost:${container.getMappedPort(6379)}`, 'RedisClient.expire actualSpanEvent.endPoint')
        actualNextAsyncId = actualSpanEvent.asyncId

        actualSpanEvent = actualSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 2)
        t.equal(actualSpanEvent.apiId, 0, 'HTTP request apiId')
        t.equal(actualSpanEvent.depth, 2, 'HTTP request depth')
        t.equal(actualSpanEvent.sequence, 2, 'HTTP request sequence')
        t.equal(actualSpanEvent.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'HTTP request serviceType')

        let actualAnnotation = actualSpanEvent.annotations.find(annotation => annotation.key === annotationKey.API.getCode())
        t.equal(actualAnnotation.value, 'http.request', 'HTTP request annotation value')

        actualHttpCallbackNextAsyncId = actualSpanEvent.asyncId
        t.equal(actualSpanChunk.spanEventList.length, 3, 'spanEventList.length')


      })
      client.expire('key', 10)
      await axios.get(`https://www.naver.com`, { httpsAgent: new https.Agent({ keepAlive: false }) })

      const actualOutgoingChildTrace = agent.getTrace(2)
      const asyncSpanChunk = actualOutgoingChildTrace.repository.dataSender.findSpanChunk(actualOutgoingChildTrace.localAsyncId)
      t.equal(asyncSpanChunk.getTraceRoot().getTraceId().getSpanId(), traceRoot.getTraceId().getSpanId(), 'HTTP request callback spanId')
      t.equal(asyncSpanChunk.getTraceRoot(), traceRoot, 'HTTP request callback transactionId')
      t.equal(asyncSpanChunk.localAsyncId.asyncId, actualHttpCallbackNextAsyncId.asyncId, 'HTTP request callback localAsyncId.asyncId')
      t.equal(asyncSpanChunk.localAsyncId.sequence, 1, 'HTTP request callback localAsyncId.sequence')

      let actualSpanEvent = asyncSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 0)
      t.equal(actualSpanEvent.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'HTTP request callback asyncInvocationDescriptor.spanEvent.apiId')
      t.equal(actualSpanEvent.depth, 1, 'HTTP request callback asyncInvocationDescriptor.spanEvent.depth')
      t.equal(actualSpanEvent.sequence, 0, 'HTTP request callback asyncInvocationDescriptor.spanEvent.sequence')
      t.equal(actualSpanEvent.serviceType, ServiceType.async.getCode(), 'HTTP request callback asyncInvocationDescriptor.spanEvent.serviceType')

      actualSpanEvent = asyncSpanChunk.spanEventList.find(spanEvent => spanEvent.sequence === 1)
      t.equal(actualSpanEvent.apiId, 0, 'HTTP request callback spanEvent.apiId')
      t.equal(actualSpanEvent.depth, 2, 'HTTP request callback spanEvent.depth')
      t.equal(actualSpanEvent.sequence, 1, 'HTTP request callback spanEvent.sequence')
      t.equal(actualSpanEvent.serviceType, ServiceType.asyncHttpClient.getCode(), 'HTTP request callback spanEvent.serviceType')

      let actualAnnotation = actualSpanEvent.annotations[0]
      t.equal(actualAnnotation.key, annotationKey.API.getCode(), 'HTTP request callback spanEvent.annotation[0].key')
      t.equal(actualAnnotation.value, 'GET', 'HTTP request callback spanEvent.annotation[0].value')
      actualAnnotation = actualSpanEvent.annotations[1]
      t.equal(actualAnnotation.key, annotationKey.HTTP_URL.getCode(), 'HTTP request callback spanEvent.annotation[1].key annotationKey.HTTP_URL')
      t.equal(actualAnnotation.value, 'www.naver.com/', 'HTTP request callback spanEvent.annotation[1].value annotationKey.HTTP_URL')
      actualAnnotation = actualSpanEvent.annotations[2]
      t.equal(actualAnnotation.key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP request callback spanEvent.annotation[2].key annotationKey.HTTP_STATUS_CODE')
      t.equal(actualAnnotation.value, 200, 'HTTP request callback spanEvent.annotation[2].value annotationKey.HTTP_STATUS_CODE')

      client.quit()
      await container.stop()
      res.json('ok')
    })

    assertTrace(trace => {
      let actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 0)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
      t.equal(actualSpanEvent.sequence, 0, 'sequence')
      t.equal(actualSpanEvent.depth, 1, 'depth')
      t.equal(actualSpanEvent.serviceType, 6600, 'serviceType')

      actualBuilder = new MethodDescriptorBuilder('set')
        .setClassName('RedisClient')
      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      actualSpanEvent = trace.spanBuilder.spanEventList.find(spanEvent => spanEvent.sequence === 1)
      t.equal(actualMethodDescriptor.apiId, actualSpanEvent.apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'RedisClient.set', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'RedisClient', 'className')
      t.equal(actualMethodDescriptor.methodName, 'set', 'methodName')
      t.equal(actualSpanEvent.sequence, 1, 'sequence')
      t.equal(actualSpanEvent.depth, 2, 'depth')
      t.equal(actualSpanEvent.serviceType, 8200, 'serviceType')
      t.equal(actualSpanEvent.destinationId, 'Redis', 'destinationId')
      t.equal(actualSpanEvent.endPoint, `localhost:${container.getMappedPort(6379)}`, 'endPoint')
    })
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const rstPush = await axios.post(getServerUrl(PATH))
    t.ok(rstPush.status, 200)

    server.close()
    t.end()
  })
})