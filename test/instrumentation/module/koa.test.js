const test = require('tape')
const axios = require('axios')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const { log, fixture, util, enableDataSending } = require('../../test-helper')

enableDataSending()

const Agent = require('agent')
const agent = new Agent(fixture.config(ServiceTypeCode.koa))

function startServer() {
  const koa = require('koa')
  return new koa()
}

function startRouter() {
  const Router = require('koa-router')
  return new Router()
}

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

setTimeout(() => agent.dataSender.closeClient(), 4000)

agent.sendApiMetaInfo()

test('Should create new trace by request', function(t) {
    t.plan(2)

  const PATH = '/koa/test'
  const app = startServer()
  const router = startRouter()
  router.get(PATH, async (ctx, next) => {
    await axios.get('http://dummy.restapiexample.com/api/v1/employees')
    ctx.body = 'Hello'
  })

  app
  .use(router.routes())
  .use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
    })
})
