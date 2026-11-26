/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const axios = require('axios')
const { finished } = require('node:stream')
const Koa = require('koa')
const Router = require('koa-router')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const ServiceType = require('../../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const { UriStatsRepository, UriStatsRepositoryBuilder } = require('../../../lib/metric/uri/uri-stats-repository')
const DateNow = require('../../../lib/support/date-now')
const { TestGrpcDataSenderBuilder, SpanAdaptor, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const http = require('http')
const https = require('https')
const { once } = require('node:events')
const RecordingDataSender = require('../../support/recording-data-sender')
const TraceContext = require('../../../lib/context/trace-context')
const SpanEventRecorder = require('../../../lib/context/trace/span-event-recorder')
const SpanRecorder = require('../../../lib/context/trace/span-recorder')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}

const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const getUriStatsRepository = (traceContext) => {
  const enricher = traceContext.traceCompletionEnricher?.enrichers?.find((e) => {
    return e && typeof e.onComplete === 'function' && e.repository
  })
  return enricher?.repository ?? UriStatsRepositoryBuilder.nullObject
}

const testName1 = 'koa-router1'
test(`${testName1} Should record request in basic route koa.test.js`, function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const testName = testName1
  const PATH = `/${testName}`
  const app = new Koa()
  const router = new Router()

  let getTraceRoot
  router.get(PATH, async (ctx, next) => {
    getTraceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok. get'
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
    t.equal(result1.status, 200)

    const getSpan = await dataSender.waitForSpan(getTraceRoot)
    t.equal(getSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code')
    t.equal(getSpan.annotations[0].value, 200, 'response status is 200')

    let actualBuilder = new MethodDescriptorBuilder('get')
      .setClassName('Router')
    const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
    let spanEvent = getSpan.spanEventList[0]
    t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
    t.equal(spanEvent.annotations[0].key, -1, 'parameter')
    t.equal(spanEvent.annotations[0].value, '/koa-router1', 'parameter value matching')
    t.true(actualMethodDescriptor.apiDescriptor.startsWith('Router.get'), 'apiDescriptor')
    t.equal(actualMethodDescriptor.className, 'Router', 'className')
    t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')

    const result2 = await axios.post(getServerUrl(PATH))
    t.equal(result2.status, 200)

    t.end()
    server.close()
  })
})

test('koa should record handler registered with pattern route', (t) => {
  t.plan(3)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: { uriStats: { httpMethod: true } }
  }).setDataSender(dataSender).build()

  const PATH = '/orders/:orderId/items/:itemId'
  const app = new Koa()
  const router = new Router()

  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok pattern'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/orders/10/items/xyz'), {
      timeout: 3000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result.status, 200, 'pattern route responds 200')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate recorded for pattern route')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), 'GET', 'httpMethod recorded when flag enabled')
    server.close()
  })
})

test('koa should disable uriTemplate/httpMethod enrichment and use null repository when isUriStatsEnabled is false', (t) => {
  t.plan(5)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: { uriStats: undefined }
  }).setDataSender(dataSender).build()

  const PATH = '/uri-stats-disabled/:orderId'
  const app = new Koa()
  const router = new Router()

  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok uri off'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-disabled/123'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri off', 'response data is ok uri off')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'uriTemplate should be undefined when uriStats is disabled')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod should be undefined when uriStats is disabled')
    t.equal(getUriStatsRepository(agent.getTraceContext()), UriStatsRepositoryBuilder.nullObject, 'UriStatsRepository should be nullObject when uriStats is disabled')
    server.close()
  })
})

test('koa should keep uriTemplate and omit httpMethod in TraceRoot when isUriStatsHttpMethodEnabled is false', (t) => {
  t.plan(5)

  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    collector: { spanPort: -1, statPort: -1, tcpPort: -1 },
    features: { uriStats: { httpMethod: false } }
  }).setDataSender(dataSender).build()

  const PATH = '/uri-stats-method-disabled/:orderId'
  const app = new Koa()
  const router = new Router()

  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok uri method off'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-method-disabled/999'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri method off', 'response data ok uri method off')

    const span = await dataSender.waitForSpan(traceRoot)
    t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate recorded when uri stats enabled')
    t.equal(span.traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod should be undefined in TraceRoot when flag disabled')
    t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'status code annotation exists')
    server.close()
  })
})

test('Should aggregate URI stats in UriStatsRepository for Koa', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const PATH = '/integration/uri-stats'
  const app = new Koa()
  const router = new Router()
  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok stats'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await dataSender.waitForSpan(traceRoot)
      const repository = getUriStatsRepository(agent.getTraceContext())

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
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats without HTTP method when disabled in config for Koa', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder({
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  }).setDataSender(dataSender).build()

  const PATH = '/integration/uri-stats/no-method'
  const app = new Koa()
  const router = new Router()
  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok stats no method'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await dataSender.waitForSpan(traceRoot)
      const repository = getUriStatsRepository(agent.getTraceContext())

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
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats for DisableTrace in Koa', function (t) {
  const agent = nullDataSenderAgent({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const PATH = '/integration/uri-stats/disable-trace'
  const app = new Koa()
  const router = new Router()
  let traceCompleted
  router.get(PATH, async (ctx) => {
    traceCompleted = new Promise(resolve => finished(ctx.res, resolve))
    ctx.body = 'ok stats disable trace'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceCompleted
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      const expectedKey = PATH
      const entry = snapshot.dataMap.get(expectedKey)

      t.ok(entry, `Entry for ${expectedKey} exists`)
      if (entry) {
        t.equal(entry.totalHistogram.count, 1, 'DisableTrace request counted in histogram')
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should record ExceptionMetaData with uriTemplate when route throws in Koa', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const PATH = '/integration/exception-meta'
  const app = new Koa()
  const router = new Router()
  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    throw new Error('koa exception test')
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        validateStatus: () => true,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await dataSender.waitForSpan(traceRoot)
      const actualExceptionMetaData = dataSender.findExceptionMetaData(traceRoot)?.valueOfProtocolBuffer()
      t.ok(actualExceptionMetaData, 'ExceptionMetaData should be sent')

      if (actualExceptionMetaData) {
        const actualTransactionId = actualExceptionMetaData.getTransactionid()
        t.ok(actualTransactionId, 'transactionId should exist')
        t.ok(actualExceptionMetaData.getSpanid(), 'spanId should exist')
        t.equal(actualExceptionMetaData.getUritemplate(), PATH, 'uriTemplate should be route path')

        const exceptions = actualExceptionMetaData.getExceptionsList()
        t.equal(exceptions.length, 1, 'exceptions length should be 1')
        if (exceptions.length > 0) {
          t.equal(exceptions[0].getExceptionclassname(), 'Error', 'exception class should be Error')
          t.ok(exceptions[0].getExceptionmessage().includes('koa exception test'), 'exception message should match')
        }
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should count failure in URI stats for DisableTrace in Koa', function (t) {
  const agent = nullDataSenderAgent({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const PATH = '/integration/uri-stats/disable-trace-failure'
  const app = new Koa()
  const router = new Router()
  let traceCompleted
  router.get(PATH, async (ctx) => {
    traceCompleted = new Promise(resolve => finished(ctx.res, resolve))
    ctx.status = 500
    ctx.body = 'error'
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        validateStatus: () => true,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceCompleted
      const repository = getUriStatsRepository(agent.getTraceContext())

      t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

      const now = DateNow.now()
      const timeWindow = 30000
      const baseTimestamp = Math.floor(now / timeWindow) * timeWindow

      const snapshot = repository.snapshotManager.getCurrent(baseTimestamp)
      t.ok(snapshot, 'Snapshot exists')

      const expectedKey = PATH
      const entry = snapshot.dataMap.get(expectedKey)

      t.ok(entry, `Entry for ${expectedKey} exists`)
      if (entry) {
        t.equal(entry.totalHistogram.count, 1, 'DisableTrace failure request counted in total histogram')
        t.equal(entry.failedHistogram.count, 1, 'DisableTrace failure request counted in failed histogram')
      }
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Functional Test: requestExceptionMetaData should deliver error.cause chain in Koa', async (t) => {
  const metadataAdaptor = new MetadataAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(metadataAdaptor)
    .addAdaptor(new SpanAdaptor())
    .build()
  t.teardown(() => {
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  let traceRoot
  const app = new Koa()
  const router = new Router()
  router.get('/exception/cause-chain', async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    const rootCause = new TypeError('koa gRPC root cause')
    throw new Error('koa gRPC request failed', { cause: rootCause })
  })
  app.use(router.routes()).use(router.allowedMethods())
  const server = app.listen(0)
  await new Promise(resolve => server.on('listening', resolve))
  await axios.get(`http://localhost:${server.address().port}/exception/cause-chain`, {
    validateStatus: () => true,
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false }),
  })
  server.close()

  const exceptionMetaData = await metadataAdaptor.exceptionMetaData(traceRoot)
  t.ok(exceptionMetaData, 'ExceptionMetaData should be delivered')

  const exceptions = exceptionMetaData.getExceptionsList()
  t.equal(exceptions.length, 2, 'should have 2 exceptions in cause chain')

  const top = exceptions[0]
  t.equal(top.getExceptionclassname(), 'Error', 'top exception class is Error')
  t.equal(top.getExceptionmessage(), 'koa gRPC request failed', 'top exception message')
  t.equal(top.getExceptiondepth(), 0, 'top exception depth is 0')

  const cause = exceptions[1]
  t.equal(cause.getExceptionclassname(), 'TypeError', 'cause class is TypeError')
  t.equal(cause.getExceptionmessage(), 'koa gRPC root cause', 'cause message')
  t.equal(cause.getExceptiondepth(), 1, 'cause depth is 1')

  t.equal(top.getExceptionid(), cause.getExceptionid(), 'shared exceptionId')
  t.ok(cause.getStacktraceelementList().length > 0, 'cause should have stack trace')
  t.end()
})

test('Koa: a route handler runs in its own Asynchronous Invocation, so the fetch() calls after each await stay under Router.get', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = new Koa()
  const router = new Router()
  router.get('/users', async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    ctx.body = 'ok'
  })
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/users`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only Router.get')
  const routeSpanEvent = span.spanEventList[0]
  t.equal(routeSpanEvent.depth, 1, 'Router.get is at depth 1')

  const handlerSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(handlerSpanEvents.length, 4, 'the Asynchronous Invocation of Router.get has the three fetch() span events')
  const [asyncInvocation, fetchA, fetchB, fetchC] = handlerSpanEvents
  t.equal(asyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get starts with the Asynchronous Invocation')
  t.equal(asyncInvocation.depth, 1, 'the Asynchronous Invocation is at depth 1')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() before the first await')
  t.equal(fetchA.sequence, 1, 'fetch a is sequence 1')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation')
  t.equal(fetchB.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch b is the fetch() after the first await')
  t.equal(fetchB.sequence, 2, 'fetch b is sequence 2')
  t.equal(fetchB.depth, 2, 'fetch b is at depth 2 under the Asynchronous Invocation')
  t.equal(fetchC.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch c is the fetch() after the second await')
  t.equal(fetchC.sequence, 3, 'fetch c is sequence 3')
  t.equal(fetchC.depth, 2, 'fetch c is at depth 2 under the Asynchronous Invocation')
  t.end()
})

test('Koa: a fetch() in a setTimeout callback of a route handler stays under Router.get', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = new Koa()
  const router = new Router()
  router.get('/timer', async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(async () => {
      await (await fetch(targetUrl)).text()
      resolve()
    }, 10))
    ctx.body = 'ok'
  })
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/timer`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only Router.get')
  const routeSpanEvent = span.spanEventList[0]

  const handlerSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(handlerSpanEvents.length, 2, 'the Asynchronous Invocation of Router.get has the fetch() span event')
  const [asyncInvocation, fetchA] = handlerSpanEvents
  t.equal(asyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get starts with the Asynchronous Invocation')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() in the setTimeout callback')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation')
  t.end()
})

test('Koa: a route that dispatches to the routes of another router responds and records its URI template', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  let traceRoot
  const v2 = new Router()
  v2.get('/v2/users/:id', async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 5))
    ctx.body = 'ok'
  })
  const v2Routes = v2.routes()
  const router = new Router()
  router.get('/v2/(.*)', (ctx, next) => v2Routes(ctx, next))
  const app = new Koa()
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/v2/users/1`)
  t.equal(response.status, 200, 'the route of the other router responds 200')
  t.equal(await response.text(), 'ok', 'the route of the other router sends its body')
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only the Router.get of the dispatching route')
  const dispatchSpanEvents = dataSender.findAsyncInvocationSpanEvents(span.spanEventList[0])
  t.equal(dispatchSpanEvents[1].serviceType, ServiceType.koa.getCode(), 'the Router.get of the other router is in the Asynchronous Invocation of the dispatching route')
  t.equal(dispatchSpanEvents[1].depth, 2, 'the Router.get of the other router is at depth 2 under that Asynchronous Invocation')
  t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), '/v2/(.*)', 'the URI template of the dispatching route is recorded first on the TraceRoot')
  t.end()
})

test('Koa: a route responds when the agent fails to record its span event', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const recordApi = SpanEventRecorder.prototype.recordApi
  SpanEventRecorder.prototype.recordApi = function () {
    throw new Error('the agent fails to record the span event')
  }
  t.teardown(() => {
    SpanEventRecorder.prototype.recordApi = recordApi
  })

  let handled = 0
  let traceInHandler
  const router = new Router()
  router.get('/agent-error', async (ctx) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    ctx.body = 'ok'
  })
  const app = new Koa()
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})

test('Koa: a route responds when the agent fails to make its Asynchronous Invocation', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const continueAsyncContextTraceObject = TraceContext.prototype.continueAsyncContextTraceObject
  TraceContext.prototype.continueAsyncContextTraceObject = function () {
    throw new Error('the agent fails to make the Asynchronous Invocation')
  }
  t.teardown(() => {
    TraceContext.prototype.continueAsyncContextTraceObject = continueAsyncContextTraceObject
  })

  let handled = 0
  let traceInHandler
  const router = new Router()
  router.get('/agent-error', async (ctx) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    ctx.body = 'ok'
  })
  const app = new Koa()
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})

test('Koa: a route responds when the agent fails to record its URI template', async (t) => {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const recordUriTemplate = SpanRecorder.prototype.recordUriTemplate
  SpanRecorder.prototype.recordUriTemplate = function () {
    throw new Error('the agent fails to record the URI template')
  }
  t.teardown(() => {
    SpanRecorder.prototype.recordUriTemplate = recordUriTemplate
  })

  let handled = 0
  let traceInHandler
  const router = new Router()
  router.get('/agent-error', async (ctx) => {
    handled++
    traceInHandler = agent.currentTraceObject()
    await new Promise(resolve => setTimeout(resolve, 5))
    ctx.body = 'ok'
  })
  const app = new Koa()
  app.use(router.routes())
  const server = app.listen(0)
  await once(server, 'listening')
  const url = `http://localhost:${server.address().port}/agent-error`
  const response = await fetch(url)
  t.equal(response.status, 200, 'the route responds 200')
  t.equal(await response.text(), 'ok', 'the route sends its body')
  const nextResponse = await fetch(url)
  t.equal(nextResponse.status, 200, 'the next request also responds 200')
  t.equal(handled, 2, 'the route handler runs for both requests')
  t.ok(traceInHandler, 'the route handler runs inside the trace of the request')
  server.close()
  t.end()
})
