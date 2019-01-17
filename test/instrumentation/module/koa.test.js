const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('../../../src/agent')
const agent = new Agent(fixture.config)

const Koa = require('koa')
const Router = require('koa-router')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'koa-router1'
test(`${testName1} Should record request in basic route`, function (t) {
  const testName = testName1

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
  })
})

const testName2 = 'koa-router2'
test.only(`${testName2} Should record internal error`, function (t) {
  const testName = testName2

  t.plan(2)

  const PATH = `/${testName2}`
  const app = new Koa()
  const router = new Router()

  const naverAuthParser = async (ctx, next) => {
    console.log('[app] before ')
    try {
      const foo = null
      const bar = foo.noValue
    } catch (err) {
      ctx.throw(500, err.message)
    }
    ctx.body = 'ok. hello world'
  }

  router.get(PATH, naverAuthParser)

  router.get('/test3', async (ctx, next) => {
    ctx.body = 'ok. hello world'
  })



  app
      .use(async (ctx, next) => {
          try {
            await next()

            const status = ctx.status || 404
            if (status === 404) {
              ctx.throw(404)
            }
          } catch (err) {
            console.log('[app] error handler')
            ctx.status = err.status || 500
            console.log(ctx.status )
            ctx.body = err.message
            console.log(err.message)
            // ctx.app.emit('error', err, ctx);
          }
      })
      .use(async (ctx, next) => {
        console.log('TEST USE')
        await next()
      })
  .use(router.routes()).use(router.allowedMethods())





  // app.use(async (ctx, next) =>{
  //   console.log('test')
  // })
  // app.on('error', (ctx, err) => {
  //   console.log('!@#?!@#')
  // })
  //app

  const server = app.listen(TEST_ENV.port, async () => {
    //const result = await axios.get(getServerUrl('/test3'))
    const result = await axios.get(getServerUrl(PATH))
    t.equal(result.status, 500)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
  })
})

test.onFinish(() => {
  agent.dataSender.closeClient()
})
