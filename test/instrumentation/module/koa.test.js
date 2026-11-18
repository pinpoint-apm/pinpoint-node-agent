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
const { UriStatsRepository, UriStatsRepositoryBuilder } = require('../../../lib/metric/uri/uri-stats-repository')
const DateNow = require('../../../lib/support/date-now')
const { TestGrpcDataSenderBuilder, SpanAdaptor, StatAdaptor, MetadataAdaptor } = require('../../support/test-grpc-data-sender')
const AgentStatsMonitor = require('../../../lib/metric/agent-stats-monitor')
const http = require('http')
const https = require('https')
const net = require('node:net')
const { once } = require('node:events')
const { sendRequestOverRawSocket } = require('../../support/raw-http-client')
const { ParentTraceHeader } = require('../../fixtures/parent-trace-header')
const RecordingDataSender = require('../../support/recording-data-sender')
const { startRequestStoreProbe } = require('../../support/request-store-probe')
const { User } = require('../../support/user')
const TraceHeaderBuilder = require('../../../lib/instrumentation/http/trace-header-builder')
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

test('Koa with error analysis disabled responds to a throwing route and records its span', function (t) {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ features: { errorAnalysis: { enabled: false } } }).setDataSender(dataSender).build()

  const routeError = new Error('koa error analysis disabled')
  const app = new Koa()
  const router = new Router()
  router.get('/error-analysis-disabled/throw', async () => {
    throw routeError
  })
  app.use(router.routes()).use(router.allowedMethods())
  let emittedError
  app.on('error', (error) => {
    emittedError = error
  })

  const server = app.listen(0, () => {
    http.get({ port: server.address().port, path: '/error-analysis-disabled/throw' }, (response) => {
      response.resume()
      response.on('end', () => setImmediate(() => {
        t.equal(response.statusCode, 500, 'Koa responds 500')
        t.equal(emittedError, routeError, 'Koa emits the error the route threw')
        t.equal(dataSender.spans().length, 1, 'the span is sent')
        const span = dataSender.spans()[0]
        t.equal(span.traceRoot.getShared().getErrorCode(), 1, 'the span is marked as error')
        t.ok(span.spanEventList.find(spanEvent => spanEvent.exceptionInfo), 'the route span event records the exception info')
        t.equal(dataSender.actualExceptionMetaData().length, 0, 'no exception meta data is sent')
        server.close()
        t.end()
      }))
    })
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

test('Koa: a fetch() that fails in a route sends the ExceptionMetaData of its async child trace', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const closedServer = net.createServer().listen(0)
  await once(closedServer, 'listening')
  const closedPort = closedServer.address().port
  await new Promise(resolve => closedServer.close(resolve))

  let traceRoot
  const app = new Koa()
  const router = new Router()
  router.get('/fetch-closed-port', async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    try {
      await fetch(`http://localhost:${closedPort}/`)
      ctx.body = 'ok'
    } catch (error) {
      ctx.status = 502
      ctx.body = error.cause?.code
    }
  })
  app.use(router.routes()).use(router.allowedMethods())
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/fetch-closed-port`)
  t.equal(response.status, 502, 'the route responds 502 after the fetch() fails')
  await dataSender.waitForSpan(traceRoot)
  server.close()

  const actualExceptionMetaDataList = dataSender.actualExceptionMetaData().filter(exceptionMetaData => exceptionMetaData.traceRoot === traceRoot)
  t.equal(actualExceptionMetaDataList.length, 1, 'one ExceptionMetaData for the request')

  const actualExceptionMetaData = actualExceptionMetaDataList[0].valueOfProtocolBuffer()
  t.equal(actualExceptionMetaData.getTransactionid().getSequence(), traceRoot.getTraceId().getTransactionId(), 'ExceptionMetaData has the transaction id of the request')
  t.equal(actualExceptionMetaData.getSpanid(), traceRoot.getTraceId().getSpanId(), 'ExceptionMetaData has the span id of the request')
  t.equal(actualExceptionMetaData.getUritemplate(), '/fetch-closed-port', 'ExceptionMetaData uriTemplate is the route path')

  const fetchSpanEvent = dataSender.findSpanChunks(traceRoot).flatMap(spanChunk => spanChunk.spanEventList).find(spanEvent => spanEvent.exception)
  const actualExceptions = actualExceptionMetaData.getExceptionsList()
  t.equal(actualExceptions.length, 1, 'ExceptionMetaData has one exception')
  t.equal(actualExceptions[0].getExceptionid(), fetchSpanEvent.exception[0].exceptionId, 'ExceptionMetaData exception is the one recorded on the fetch() span event of the SpanChunk')
  t.end()
})

test('Koa: the gRPC resources that send the request data do not take the request store', async (t) => {
  const spanAdaptor = new SpanAdaptor()
  const grpcDataSender = await new TestGrpcDataSenderBuilder()
    .addAdaptor(spanAdaptor)
    .addAdaptor(new MetadataAdaptor())
    .build()
  const probe = startRequestStoreProbe()
  t.teardown(() => {
    probe.stop()
    grpcDataSender.close()
  })
  const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()

  let traceRoot
  const app = new Koa()
  const router = new Router()
  router.get('/request-store', (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/request-store`)
  t.equal(response.status, 200, 'the route responds 200')

  await spanAdaptor.span(traceRoot)
  server.close()
  t.deepEqual(probe.capturedTypes(), [], 'no HTTP/2 resource is created with the request store')
  t.end()
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

test('Koa: Should not mark a client disconnect before the response as an error', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const PATH = '/client-disconnect'
  const app = new Koa()
  const router = new Router()
  let client
  router.get(PATH, async (ctx) => {
    dataSender.waitForSpan(agent.currentTraceObject().getTraceRoot()).then(assertSuccess)
    const responseClosed = new Promise((resolve) => ctx.res.on('close', resolve))
    client.destroy()
    await responseClosed
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(0, () => {
    client = sendRequestOverRawSocket(server.address().port, PATH)
  })

  function assertSuccess(span) {
    t.equal(span.annotations[0].key, annotationKey.HTTP_STATUS_CODE.getCode(), 'HTTP status code annotation is recorded')
    t.equal(span.annotations[0].value, 200, 'HTTP status code is 200')
    t.equal(span.traceRoot.getShared().getErrorCode(), undefined, 'client disconnect does not mark the error code')

    const repository = getUriStatsRepository(agent.getTraceContext())
    t.ok(repository instanceof UriStatsRepository, 'Repository is initialized')

    const timeWindow = 30000
    const baseTimestamp = Math.floor(DateNow.now() / timeWindow) * timeWindow
    const entry = repository.snapshotManager.getCurrent(baseTimestamp)?.dataMap.get(`GET ${PATH}`)
    t.ok(entry, `Entry for GET ${PATH} exists`)
    if (entry) {
      t.equal(entry.totalHistogram.count, 1, 'client disconnect counted in total histogram')
      t.equal(entry.failedHistogram.count, 0, 'client disconnect not counted in failed histogram')
    }

    server.close()
    t.end()
  }
})

test('Koa: v4 serviceName is sent as Pinpoint-pServiceName and an inbound one is recorded as parentServiceName', function (t) {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ serviceName: 'koa.service' }).setDataSender(dataSender).build()

  const PATH = '/parent-service-name'
  const OUTGOING_PATH = '/parent-service-name/outgoing'
  const app = new Koa()
  const router = new Router()
  let outgoingRequestHeaders
  router.get(PATH, async (ctx) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    ctx.body = 'ok'
  })
  router.get(OUTGOING_PATH, async (ctx) => {
    outgoingRequestHeaders = ctx.request.headers
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { headers: ParentTraceHeader.header('pinpoint-pservicename', 'parent.service'), httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-pservicename'], 'koa.service', 'outgoing request has Pinpoint-pServiceName header of the Config serviceName')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.parentServiceName, 'parent.service', 'span parentServiceName is the inbound Pinpoint-pServiceName')
      t.equal(span.toProtocolBuffer().getSpan().getAcceptevent().getParentinfo().getParentservicename(), 'parent.service', 'PParentInfo.parentServiceName is the inbound Pinpoint-pServiceName')

      const outgoingSpan = dataSender.spans().find(span => span.rpc === OUTGOING_PATH)
      t.equal(outgoingSpan.parentServiceName, 'koa.service', 'next hop span parentServiceName is this agent serviceName')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: inbound Pinpoint headers are recorded on the span', function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const PATH = '/inbound-pinpoint-headers'
  const app = new Koa()
  const router = new Router()
  let traceRoot
  router.get(PATH, async (ctx) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(0, async () => {
    const url = `http://localhost:${server.address().port}${PATH}`
    try {
      const response = await new User().fetch(url, { headers: ParentTraceHeader.header('pinpoint-host', 'parent.host:5006') })
      t.equal(response.status, 200, 'responds with 200')
      const span = (await dataSender.waitForSpan(traceRoot)).toProtocolBuffer().getSpan()
      t.equal(span.getTransactionid().getAgentid(), 'parent.agent', 'PTransactionId.agentId is the Pinpoint-TraceID agentId')
      t.equal(span.getTransactionid().getAgentstarttime(), '1599831487121', 'PTransactionId.agentStartTime is the Pinpoint-TraceID agentStartTime')
      t.equal(span.getTransactionid().getSequence(), '4', 'PTransactionId.sequence is the Pinpoint-TraceID sequence')
      t.equal(span.getSpanid(), '-387300102333636357', 'PSpan.spanId is the Pinpoint-SpanID')
      t.equal(span.getParentspanid(), '3116250228920588432', 'PSpan.parentSpanId is the Pinpoint-pSpanID')
      t.equal(span.getFlag(), 0, 'PSpan.flag is the Pinpoint-Flags')
      t.equal(span.getAcceptevent().getParentinfo().getParentapplicationname(), 'parent.application', 'PParentInfo.parentApplicationName is the Pinpoint-pAppName')
      t.equal(span.getAcceptevent().getParentinfo().getParentapplicationtype(), 1210, 'PParentInfo.parentApplicationType is the Pinpoint-pAppType')
      t.equal(span.getAcceptevent().getParentinfo().getAcceptorhost(), 'parent.host:5006', 'PParentInfo.acceptorHost is the Pinpoint-Host')

      const flagsResponse = await new User().fetch(url, { headers: ParentTraceHeader.header('pinpoint-flags', 'abc') })
      t.equal(flagsResponse.status, 200, 'Pinpoint-Flags abc responds with 200')
      const flagsSpan = (await dataSender.waitForSpan(traceRoot)).toProtocolBuffer().getSpan()
      t.equal(flagsSpan.getFlag(), 0, 'Pinpoint-Flags abc is PSpan.flag 0')

      const parentApplicationTypeResponse = await new User().fetch(url, { headers: ParentTraceHeader.header('pinpoint-papptype', '') })
      t.equal(parentApplicationTypeResponse.status, 200, 'an empty Pinpoint-pAppType responds with 200')
      const parentApplicationTypeSpan = (await dataSender.waitForSpan(traceRoot)).toProtocolBuffer().getSpan()
      t.equal(parentApplicationTypeSpan.getAcceptevent().getParentinfo().getParentapplicationtype(), -1, 'an empty Pinpoint-pAppType is PParentInfo.parentApplicationType UNDEFINED -1')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: the request is handled without a trace when the agent fails to make the trace', function (t) {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const build = TraceHeaderBuilder.prototype.build
  TraceHeaderBuilder.prototype.build = function () {
    throw new Error('the agent fails to make the trace')
  }
  t.teardown(() => {
    TraceHeaderBuilder.prototype.build = build
  })

  const PATH = '/agent-error/make-trace'
  const app = new Koa()
  const router = new Router()
  let traceInHandler
  router.get(PATH, async (ctx) => {
    traceInHandler = agent.currentTraceObject()
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(0, async () => {
    try {
      const response = await new User().fetch(`http://localhost:${server.address().port}${PATH}`)
      t.equal(response.status, 200, 'responds with 200')
      t.equal(response.body, 'ok', 'the route handler runs')
      t.equal(traceInHandler, undefined, 'the route handler runs without a trace')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: the request is handled when the agent fails to record the response', function (t) {
  const agent = new ProcessAgentBuilder().setDataSender(new RecordingDataSender()).build()
  const recordAttribute = SpanRecorder.prototype.recordAttribute
  SpanRecorder.prototype.recordAttribute = function (key, value) {
    if (key === annotationKey.HTTP_STATUS_CODE) {
      throw new Error('the agent fails to record the response')
    }
    return recordAttribute.call(this, key, value)
  }
  t.teardown(() => {
    SpanRecorder.prototype.recordAttribute = recordAttribute
  })

  const PATH = '/agent-error/record-response'
  const app = new Koa()
  const router = new Router()
  let traceInHandler
  router.get(PATH, async (ctx) => {
    traceInHandler = agent.currentTraceObject()
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(0, async () => {
    const url = `http://localhost:${server.address().port}${PATH}`
    try {
      const response = await new User().fetch(url)
      t.equal(response.status, 200, 'responds with 200')
      t.ok(traceInHandler, 'the route handler runs with a trace')

      const nextResponse = await new User().fetch(url)
      t.equal(nextResponse.status, 200, 'the next request also responds with 200')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: v3 sends no Pinpoint-pServiceName and an inbound request without it leaves parentServiceName unset', function (t) {
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ serviceName: 'ignored.service', collector: { ip: '127.0.0.1', spanPort: -1, statPort: -1, tcpPort: -1, protocolVersion: 'v3' } }).setDataSender(dataSender).build()

  const PATH = '/parent-service-name'
  const OUTGOING_PATH = '/parent-service-name/outgoing'
  const app = new Koa()
  const router = new Router()
  let outgoingRequestHeaders
  router.get(PATH, async (ctx) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    ctx.body = 'ok'
  })
  router.get(OUTGOING_PATH, async (ctx) => {
    outgoingRequestHeaders = ctx.request.headers
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { headers: ParentTraceHeader.header('pinpoint-pappname', 'parent.application'), httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-pappname'], 'test.application.name', 'outgoing request has Pinpoint-pAppName header')
      t.equal(outgoingRequestHeaders['pinpoint-pservicename'], undefined, 'v3 outgoing request has no Pinpoint-pServiceName header even with serviceName set')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.parentApplicationName, 'parent.application', 'span parentApplicationName is the inbound Pinpoint-pAppName')
      t.equal(span.parentServiceName, undefined, 'span parentServiceName is unset')
      t.equal(span.toProtocolBuffer().getSpan().getAcceptevent().getParentinfo().getParentservicename(), '', 'PParentInfo.parentServiceName is unset')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: application service type is NODE 1400 even with PINPOINT_SERVICE_TYPE and json applicationServiceType', function (t) {
  process.env.PINPOINT_SERVICE_TYPE = '1600'
  const dataSender = new RecordingDataSender()
  new ProcessAgentBuilder({ applicationServiceType: 1500 }).setDataSender(dataSender).build()
  delete process.env.PINPOINT_SERVICE_TYPE

  const PATH = '/application-service-type'
  const OUTGOING_PATH = '/application-service-type/outgoing'
  const app = new Koa()
  const router = new Router()
  let outgoingRequestHeaders
  router.get(PATH, async (ctx) => {
    await axios.get(getServerUrl(OUTGOING_PATH), { httpAgent: new http.Agent({ keepAlive: false }) })
    ctx.body = 'ok'
  })
  router.get(OUTGOING_PATH, async (ctx) => {
    outgoingRequestHeaders = ctx.request.headers
    ctx.body = 'ok'
  })
  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false }) })

      t.equal(outgoingRequestHeaders['pinpoint-papptype'], '1400', 'outgoing request has Pinpoint-pAppType header of NODE 1400')

      const span = dataSender.spans().find(span => span.rpc === PATH)
      t.equal(span.toProtocolBuffer().getSpan().getApplicationservicetype(), 1400, 'PSpan.applicationServiceType is NODE 1400')

      const outgoingSpan = dataSender.spans().find(span => span.rpc === OUTGOING_PATH)
      t.equal(outgoingSpan.parentApplicationType, 1400, 'next hop span parentApplicationType is NODE 1400')
    } catch (error) {
      t.fail(error.stack)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Koa: AgentStat sends the transaction count and response time of completed requests', (t) => {
  const statAdaptor = new StatAdaptor()
  const grpcDataSenderBuilder = new TestGrpcDataSenderBuilder().addAdaptor(statAdaptor)
    .addAdaptor(new SpanAdaptor())
    .addAdaptor(new MetadataAdaptor())

  grpcDataSenderBuilder.build().then((grpcDataSender) => {
    const agent = new ProcessAgentBuilder().setDataSender(grpcDataSender.toDataSender()).build()
    const agentStatsMonitor = new AgentStatsMonitor(grpcDataSender, agent.getConfig().getAgentId(), agent.agentStartTime)

    const app = new Koa()
    const router = new Router()
    router.get('/tps', async (ctx) => {
      await new Promise(resolve => setTimeout(resolve, 10))
      ctx.body = 'ok'
    })
    app.use(router.routes())

    const server = app.listen(TEST_ENV.port, async () => {
      try {
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })
        await axios.get(getServerUrl('/tps'), { httpAgent: new http.Agent({ keepAlive: false }) })

        const statsInfo = await agentStatsMonitor.send()
        const pAgentStat = await statAdaptor.agentStat(statsInfo.timestamp)

        t.equal(pAgentStat.getTransaction().getSamplednewcount(), 3, 'PTransaction.sampledNewCount is 3 requests')
        t.ok(pAgentStat.getResponsetime().getMax() > 0, 'PResponseTime.max is greater than 0')
        t.ok(pAgentStat.getCollectinterval() > 0, 'collectInterval is the time since the AgentStatsMonitor was created')
      } catch (error) {
        t.fail(error.stack)
      } finally {
        agentStatsMonitor.shutdown()
        server.close(() => {
          grpcDataSender.close()
          t.end()
        })
      }
    })
  })
})
