const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('agent')
const agent = new Agent(fixture.config)

const express = require('express')
const ioRedis = require('ioredis');
const Redis = require('redis');
const Koa = require('koa')
const Router = require('koa-router')
const koaBodyParser = require('koa-bodyparser')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

// close client connection
const testCompletions = new Map()
setInterval(() => {
  if (Array.from(testCompletions.values()).every(v => v)) {
    agent.dataSender.closeClient()
  }
}, 2000)

const redisData = {
  name: 'jundol',
  job: 'bon developer',
  salary: 500000000,
}

const testName1 = 'express-redis'
test(`${testName1} should Record the connections between express and redis.`, function (t) {
  const testName = testName1
  testCompletions.set(testName, false)

  t.plan(3)

  const app = new express()
  const client = Redis.createClient(6379,'***REMOVED***')
  const PATH = `/${testName}`

  app.use(express.json())
  app.use(function(req,res,next){
    req.cache = client
    next()
  })
  app.post(PATH, function(req,res,next){
    req.accepts('application/json')
    var key = req.body.name
    var value = JSON.stringify(req.body)
    req.cache.set(key,value,function(err,data){
      if(err){
        console.log(err)
        res.send("error "+err)
        return
      }
      req.cache.expire(key,10)
      res.json(value)
    })
  })
  app.get(`${PATH}/:name`,function(req,res,next){
    var key = req.params.name
    req.cache.get(key, function(err,data){
      if(err){
        console.log(err)
        res.send("error "+err)
        return
      }
      var value = JSON.parse(data)
      res.json(value)
    })
  })
  app.use(function(req, res, next) {
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
    testCompletions.set(testName, true)
  })
})

const testName2 = 'express-ioredis'
test(`${testName2} should Record the connections between express and ioredis.`, function (t) {
  const testName = testName2
  testCompletions.set(testName, false)

  t.plan(3)

  const app = new express()
  const redis = new ioRedis(6379, '***REMOVED***')
  const PATH = `/${testName}`

  app.use(express.json())
  app.use(function(req,res,next){
    req.cache = redis
    next()
  })
  app.post(PATH, function(req,res,next){
    req.accepts('application/json')
    var key = req.body.name
    var value = JSON.stringify(req.body)
    req.cache.set(key,value,function(err,data){
      if(err){
        console.log(err)
        res.send("error "+err)
        return
      }
      req.cache.expire(key,10)
      res.json(value)
    })
  })
  app.get(`${PATH}/:name`,function(req,res,next){
    var key = req.params.name
    req.cache.get(key, function(err,data){
      if(err){
        console.log(err)
        res.send("error "+err)
        return
      }
      var value = JSON.parse(data)
      res.json(value)
    })
  })
  app.use(function(req, res, next) {
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
    testCompletions.set(testName, true)
  })
})

const testName3 = 'koa-redis'
test(`${testName3} should Record the connections between koa and redis.`, function (t) {
  const testName = testName3
  testCompletions.set(testName, false)

  t.plan(3)

  const app = new Koa()
  const router = new Router()
  const client = Redis.createClient(6379,'***REMOVED***')
  const PATH = `/${testName3}`

  app.use(koaBodyParser())
  router.post(PATH, async function(ctx, next) {
    console.log(ctx.request.body)
    const key = ctx.request.body.name
    const value = JSON.stringify(ctx.request.body)

    client.set(key, value, function(err, data) {
      if(err){
        console.log(err)
        ctx.body = `error :: ${err}`
        return
      }
      redis.expire(key, 10)
      ctx.body = JSON.parse(value)
    });
  });

  router.get(`${PATH}/:name`, async (ctx, next) => {
    const key = ctx.params.name
    console.log(key)
    client.get(key, async function(err ,data){
      if(err){
        console.log(err)
        ctx.body = `error :: ${err}`
        return
      }
      ctx.body = JSON.parse(data)
    })
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})

const testName4 = 'koa-ioredis'
test(`${testName4} should Record the connections between koa and ioredis.`, function (t) {
  const testName = testName4
  testCompletions.set(testName, false)

  t.plan(3)

  const app = new Koa()
  const router = new Router()
  const redis = new ioRedis(6379,'***REMOVED***')
  const PATH = `/${testName4}`

  app.use(koaBodyParser())
  router.post(PATH, async function(ctx, next) {
    console.log(ctx.request.body)
    const key = ctx.request.body.name
    const value = JSON.stringify(ctx.request.body)

    redis.set(key, value, function(err, data) {
      if(err){
        console.log(err)
        ctx.body = `error :: ${err}`
        return
      }
      redis.expire(key, 10)
      ctx.body = JSON.parse(value)
    });
  });

  router.get(`${PATH}/:name`, async (ctx, next) => {
    const key = ctx.params.name
    console.log(key)
    redis.get(key, async function(err ,data){
      if(err){
        console.log(err)
        ctx.body = `error :: ${err}`
        return
      }
      ctx.body = JSON.parse(data)
    });
  });
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const rstPush = await axios.post(getServerUrl(PATH), redisData)
    t.ok(rstPush.status, 200)

    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})





