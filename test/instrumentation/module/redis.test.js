/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')

const { log } = require('../../test-helper')

const agent = require('../../support/agent-singleton-mock')

const express = require('express')
const Koa = require('koa')
const Router = require('koa-router')
const koaBodyParser = require('koa-bodyparser')

const { GenericContainer } = require('testcontainers')

const ioRedis = require('ioredis-mock')
const Redis = require('redis-mock')

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
test(`${testName1} should Record the connections between express and redis.`, function (t) {
  agent.bindHttp()

  const testName = testName1

  t.plan(3)

  const app = new express()
  const client = Redis.createClient()
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

    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName2 = 'express-ioredis'
test(`${testName2} should Record the connections between express and ioredis.`, function (t) {
  agent.bindHttp()

  const testName = testName2

  t.plan(2)

  const app = new express()
  const redis = new ioRedis()
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

    // const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    // t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName3 = 'koa-redis'
test(`${testName3} should Record the connections between koa and redis.`, function (t) {
  agent.bindHttp()

  const testName = testName3

  t.plan(2)

  const app = new Koa()
  const router = new Router()
  const client = Redis.createClient()

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
    });
  });

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

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName4 = 'koa-ioredis'
test(`${testName4} should Record the connections between koa and ioredis.`, function (t) {
  agent.bindHttp()

  const testName = testName4

  t.plan(2)

  const app = new Koa()
  const router = new Router()
  const redis = new ioRedis()

  const PATH = `/${testName}`
  app.use(koaBodyParser())
  router.post(PATH, async function (ctx, next) {
    const key = ctx.request.body.name
    const value = JSON.stringify(ctx.request.body)
    await redis.set(key, value)
    ctx.body = 'test'
  });

  router.get(`${PATH}/:name`, async (ctx, next) => {
    const key = ctx.params.name
    // await Promise.all([
    //   redis.get(key),
    //   redis.get(key),
    //   redis.get(key)
    // ])


    redis.get(key)

    redis.get(key)
    redis.get(key)

    ctx.body = 'test'
  });

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    console.log('Step1.')
    // const rstPush = await axios.post(getServerUrl(PATH), redisData)
    // t.ok(rstPush.status, 200)
    console.log('Step2.')
    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})