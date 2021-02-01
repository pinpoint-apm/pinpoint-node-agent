/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')

const agent = require('../../support/agent-singleton-mock')

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

const testName2 = 'koa-elastic'
test.skip(`${testName2} should Record the connections between koa and ioredis.`, function (t) {
  const testName = testName2

  t.plan(3)

  class Client extends elasticsearch.Client {
    constructor() {
      super()
    }
  }

  const app = new Koa()
  const router = new Router()
  const client = new Client()

  const PATH = `/${testName}`

  app.use(koaBodyParser())
  router.post(PATH, async function(ctx, next) {
    ctx.body = 'test'
  });

  router.get(`${PATH}/:name`, async (ctx, next) => {
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
