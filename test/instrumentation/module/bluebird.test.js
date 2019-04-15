const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('../../../lib/agent')
const agent = new Agent(fixture.config)

const Koa = require('koa')
const Router = require('koa-router')
const Promise = require("bluebird");

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'koa-router1'
test(`${testName1} Should record request in basic route`, function (t) {
  const testName = testName1

  t.plan(3)

  const PATH = `/${testName}`
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx, next) => {
    ctx.body = 'ok. get'
  })
  router.post(PATH, async (ctx, next) => {
    ctx.body = 'ok. post'
  })

  app.use(router.routes()).use(router.allowedMethods())

  co


  t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
  })
})
