const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('../../../lib/agent')
const agent = new Agent(fixture.config)
const elasticsearch = require('elasticsearch')

const express = require('express')

const Koa = require('koa')
const Router = require('koa-router')
const koaBodyParser = require('koa-bodyparser')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`


const testName1 = 'express-elastic'
test(`${testName1} should Record the connections between express and redis.`, function (t) {
  const testName = testName1

  t.plan(3)

  const app = new express()
  const PATH = `/${testName}`

  app.use(express.json())
  app.use(function(req,res,next){
  })
  app.post(PATH, function(req,res,next){
  })
  app.get(`${PATH}/:name`,function(req,res,next){
  })
  app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })
  const server = app.listen(TEST_ENV.port, async function () {
    // const rstPush = await axios.post(getServerUrl(PATH), redisData)
    // t.ok(rstPush.status, 200)
    //
    // const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    // t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

const testName2 = 'koa-elastic'
test.only(`${testName2} should Record the connections between koa and ioredis.`, function (t) {
  const testName = testName2

  t.plan(3)

  const app = new Koa()
  const router = new Router()
  const client = new elasticsearch.Client({ host: '***REMOVED***:9200'})

  const PATH = `/${testName}`

  // client.ping({
  //   requestTimeout: 1000 // ping usually has a 3000ms timeout
  // }, function (error) {
  //   if (error) {
  //     console.trace('elasticsearch cluster is down!');
  //   } else {
  //     console.log('All is well');
  //   }
  // })

  app.use(koaBodyParser())
  router.post(PATH, async function(ctx, next) {
    ctx.body = 'test'
  });

  router.get(`${PATH}/:name`, async (ctx, next) => {
    console.log('TEST?')
    // const response = await client.search({
    //   index: 'classes',
    //   type: 'class',
    //   body: {
    //     query: {
    //       match: { 'professor' : 'jundol' }
    //     }
    //   }
    // })

    const response = await client.search({
     q: 'jundol'
    })
    for (const professor of response.hits.hits) {
      console.log('professor:', professor);
    }

    ctx.body = 'test'
  });

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    console.log('Step1.')
    const rstGet = await axios.get(getServerUrl(`${PATH}/jundol`))
    t.ok(rstGet.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})

test.onFinish(() => {
  agent.pinpointClient.dataSender.closeClient()
})
