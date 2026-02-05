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


test('koa should record handler registered with pattern route', (t) => {
  t.plan(3)

  agent.bindHttp({
    features: { uriStats: { httpMethod: true } }
  })

  const PATH = '/orders/:orderId/items/:itemId'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok pattern'

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.uriTemplate, PATH, 'uriTemplate recorded for pattern route')
      t.equal(trace.spanBuilder.httpMethod, 'GET', 'httpMethod recorded when flag enabled')
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/orders/10/items/xyz'), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'pattern route responds 200')
    server.close()
  })
})

test('koa should skip uri stats when isUriStatsEnabled is false', (t) => {
  t.plan(4)

  agent.bindHttp({
    features: { uriStats: undefined }
  })

  const PATH = '/uri-stats-disabled/:orderId'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok uri off'

    agent.callbackTraceClose((trace) => {
      t.notOk(trace.spanBuilder.uriTemplate, 'uriTemplate not recorded when uri stats disabled')
      t.notOk(trace.spanBuilder.httpMethod, 'httpMethod not recorded when uri stats disabled')
      server.close()
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-disabled/123'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri off', 'response data ok uri off')
  })
})

test('koa should keep uriTemplate but skip httpMethod when isUriStatsHttpMethodEnabled is false', (t) => {
  t.plan(5)

  agent.bindHttp({
    collector: { spanPort: -1, statPort: -1, tcpPort: -1 },
    features: { uriStats: { httpMethod: false } }
  })

  const PATH = '/uri-stats-method-disabled/:orderId'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok uri method off'

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.uriTemplate, PATH, 'uriTemplate recorded when uri stats enabled')
      t.notOk(trace.spanBuilder.httpMethod, 'httpMethod not recorded when flag disabled')
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'status code annotation exists')
      server.close()
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-method-disabled/999'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri method off', 'response data ok uri method off')
  })
})

test('koa should record uriTemplate and httpMethod in router', (t) => {
  t.plan(3)

  agent.bindHttp({
    collector: { spanPort: -1, statPort: -1, tcpPort: -1 },
    features: { uriStats: { httpMethod: true } }
  })

  const PATH = '/books/:bookId/pages/:pageId'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok pattern'

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.uriTemplate, PATH, 'records uriTemplate')
      t.equal(trace.spanBuilder.httpMethod, 'GET', 'records httpMethod')
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/books/123/pages/9'))
    t.equal(result.status, 200, 'pattern route responds 200')
    server.close()
  })
})
test('Should aggregate URI stats in UriStatsRepository for Koa', function (t) {
  agent.bindHttp()

  const { getUriStatsRepository } = require('../../../lib/metric/uri-stats')
  const { UriStatsRepository } = require('../../../lib/metric/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok stats'

    agent.callbackTraceClose((trace) => {
      const repository = getUriStatsRepository()

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      if (snapshot) {
        // Default: METHOD URI
        const expectedKey = `GET ${PATH}`
        const entry = snapshot.dataMap.get(expectedKey)

        t.ok(entry, `Entry for ${expectedKey} exists`)
        if (entry) {
          t.equal(entry.totalHistogram.count, 1, 'Request counted in histogram')
        }
      }

      server.close()
      t.end()
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    await axios.get(getServerUrl(PATH))
  })
})

test('Should aggregate URI stats without HTTP method when disabled in config for Koa', function (t) {
  agent.bindHttp({
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { getUriStatsRepository } = require('../../../lib/metric/uri-stats')
  const { UriStatsRepository } = require('../../../lib/metric/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/no-method'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok stats no method'

    agent.callbackTraceClose((trace) => {
      const repository = getUriStatsRepository()

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      if (snapshot) {
        // Disabled: URI
        const expectedKey = PATH
        const entry = snapshot.dataMap.get(expectedKey)

        t.ok(entry, `Entry for ${expectedKey} exists`)
        if (entry) {
          t.equal(entry.totalHistogram.count, 1, 'Request counted in histogram')
        }
      }

      server.close()
      t.end()
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    await axios.get(getServerUrl(PATH))
  })
})
