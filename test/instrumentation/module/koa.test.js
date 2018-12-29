const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('agent')
const agent = new Agent(fixture.config)

const Koa = require('koa')
const Router = require('koa-router')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testCompletions = new Map()
setInterval(() => {
  if (Array.from(testCompletions.values()).every(v => v)) {
    agent.dataSender.closeClient()
  }
}, 2000)

// send api meta info
agent.sendApiMetaInfo()

const testName1 = 'koa-router1'
test.only(`${testName1} Should record request in basic route`, function (t) {
  const testName = testName1
  testCompletions.set(testName, false)

  t.plan(3)

  const PATH = `/${testName1}`
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx, next) => {
    ctx.body = 'ok. get'
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

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})

const testName2 = 'koa-router2'
test(`${testName2} Should record internal error`, function (t) {
  const testName = testName2
  testCompletions.set(testName, false)

  t.plan(2)

  const PATH = `/${testName2}`
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx, next) => {
    console.log('[app] before ')
    try {
      const foo = null
      const bar = foo.noValue
    } catch (err) {
      ctx.throw(500, err.message);
    }
    ctx.body = 'ok. hello world'
  })

  app.use(async (ctx, next) => {
    try {
      await next()
      const status = ctx.status || 404
      if (status === 404) {
        ctx.throw(404)
      }
    } catch (err) {
      console.log('[app] error handler')
      ctx.status = err.status || 500
      ctx.body = err.message
    }
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 500)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })

  testCompletions.set(testName, true)
})

