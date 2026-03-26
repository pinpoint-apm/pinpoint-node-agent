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
const { UriStatsRepositoryBuilder } = require('../../../lib/metric/uri/uri-stats-repository')
const grpc = require('@grpc/grpc-js')
const services = require('../../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../../lib/data/v1/Span_pb')
const GrpcDataSenderBuilder = require('../../client/grpc-data-sender-builder')
const http = require('http')
const https = require('https')


const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}

const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const getUriStatsRepository = () => {
  const traceCompletionEnricher = agent.traceContext?.traceCompletionEnrichers?.find((enricher) => {
    return enricher && typeof enricher.onComplete === 'function' && enricher.repository
  })
  return traceCompletionEnricher?.repository ?? UriStatsRepositoryBuilder.nullObject
}

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
      const traceRoot = trace.spanBuilder.getTraceRoot()
      t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate recorded for pattern route')
      t.equal(traceRoot.getEnricher('uriStats.method'), 'GET', 'httpMethod recorded when flag enabled')
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

test('koa should disable uriTemplate/httpMethod enrichment and use null repository when isUriStatsEnabled is false', (t) => {
  t.plan(5)

  agent.bindHttp({
    features: { uriStats: undefined }
  })

  const PATH = '/uri-stats-disabled/:orderId'
  const app = new Koa()
  const router = new Router()

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok uri off'

    agent.callbackTraceClose((trace) => {
      const traceRoot = trace.spanBuilder.getTraceRoot()
      t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), undefined, 'uriTemplate should be undefined when uriStats is disabled')
      t.equal(traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod should be undefined when uriStats is disabled')
      t.equal(getUriStatsRepository(), UriStatsRepositoryBuilder.nullObject, 'UriStatsRepository should be nullObject when uriStats is disabled')
      server.close()
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    const result = await axios.get(getServerUrl('/uri-stats-disabled/123'))
    t.equal(result.status, 200, 'request responds 200')
    t.equal(result.data, 'ok uri off', 'response data is ok uri off')
  })
})

test('koa should keep uriTemplate and omit httpMethod in TraceRoot when isUriStatsHttpMethodEnabled is false', (t) => {
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
      const traceRoot = trace.spanBuilder.getTraceRoot()
      t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'uriTemplate recorded when uri stats enabled')
      t.equal(traceRoot.getEnricher('uriStats.method'), undefined, 'httpMethod should be undefined in TraceRoot when flag disabled')
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
      const traceRoot = trace.spanBuilder.getTraceRoot()
      t.equal(traceRoot.getEnricher('uriStats.uriTemplate'), PATH, 'records uriTemplate')
      t.equal(traceRoot.getEnricher('uriStats.method'), 'GET', 'records httpMethod')
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

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok stats'

    agent.callbackTraceClose((trace) => {
      setImmediate(() => {
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

        resolveTraceClosed()
      })
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
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

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/no-method'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok stats no method'

    agent.callbackTraceClose((trace) => {
      setImmediate(() => {
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

        resolveTraceClosed()
      })
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should aggregate URI stats for DisableTrace in Koa', function (t) {
  agent.bindHttp({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/disable-trace'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    ctx.body = 'ok stats disable trace'

    agent.callbackTraceClose(() => {
      setImmediate(() => {
        const repository = getUriStatsRepository()

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

        resolveTraceClosed()
      })
    })
  })

  app.use(router.routes()).use(router.allowedMethods())

  const server = app.listen(TEST_ENV.port, async () => {
    try {
      await axios.get(getServerUrl(PATH), {
        timeout: 3000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should not collect ExceptionMetaData when errorAnalysis is disabled in Koa', function (t) {
  agent.bindHttp({
    features: {
      errorAnalysis: undefined
    }
  })

  const PATH = '/integration/exception-disabled'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    agent.callbackTraceClose((trace) => {
      setImmediate(() => {
        const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
        t.equal(actualExceptionMetaData, undefined, 'ExceptionMetaData should not be sent when errorAnalysis is disabled')

        resolveTraceClosed()
      })
    })
    throw new Error('koa error analysis disabled test')
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
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should record ExceptionMetaData with uriTemplate when route throws in Koa', function (t) {
  agent.bindHttp()

  const PATH = '/integration/exception-meta'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    agent.callbackTraceClose((trace) => {
      setImmediate(() => {
        const actualExceptionMetaData = trace.repository.dataSender.dataSender.actualExceptionMetaData
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

        resolveTraceClosed()
      })
    })
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
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Should count failure in URI stats for DisableTrace in Koa', function (t) {
  agent.bindHttp({
    sampling: { enable: false },
    features: {
      uriStats: {
        httpMethod: false,
        capacity: 1000
      }
    }
  })

  const { UriStatsRepository } = require('../../../lib/metric/uri/uri-stats-repository')
  const DateNow = require('../../../lib/support/date-now')

  const PATH = '/integration/uri-stats/disable-trace-failure'
  const app = new Koa()
  const router = new Router()
  let resolveTraceClosed
  const traceClosed = new Promise((resolve) => {
    resolveTraceClosed = resolve
  })

  router.get(PATH, async (ctx) => {
    agent.callbackTraceClose(() => {
      setImmediate(() => {
        const repository = getUriStatsRepository()

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

        resolveTraceClosed()
      })
    })
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
      await traceClosed
    } catch (e) {
      t.fail(e)
    } finally {
      server.close()
      t.end()
    }
  })
})

test('Functional Test: requestExceptionMetaData should deliver error.cause chain in Koa', (t) => {
  const collectorServer = new grpc.Server()
  let dataSender
  let metadataReceived
  const metadataReceivedPromise = new Promise((resolve, reject) => {
    metadataReceived = { resolve, reject }
  })

  collectorServer.addService(services.SpanService, {
    sendSpan: function (call) {
      call.on('data', function () {})
    },
  })
  collectorServer.addService(services.MetadataService, {
    requestExceptionMetaData: (call, callback) => {
      callback(null, new spanMessages.PResult())

      try {
        const exceptionMetaData = call.request
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

        metadataReceived.resolve()
      } catch (error) {
        metadataReceived.reject(error)
      }
    }
  })

  collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      t.fail(err)
      collectorServer.forceShutdown()
      t.end()
      return
    }

    dataSender = new GrpcDataSenderBuilder(port)
      .enableExceptionMetaData()
      .build()
    agent.bindHttp(dataSender)

    const app = new Koa()
    const router = new Router()

    router.get('/exception/cause-chain', async (ctx) => {
      const rootCause = new TypeError('koa gRPC root cause')
      throw new Error('koa gRPC request failed', { cause: rootCause })
    })

    app.use(router.routes()).use(router.allowedMethods())

    const server = app.listen(0, async () => {
      try {
        const serverPort = server.address().port
        await axios.get(`http://localhost:${serverPort}/exception/cause-chain`, {
          validateStatus: () => true,
          httpAgent: new http.Agent({ keepAlive: false }),
          httpsAgent: new https.Agent({ keepAlive: false }),
        })
        await metadataReceivedPromise
      } catch (error) {
        t.fail(error?.stack || error?.message || String(error))
      } finally {
        server.close(() => {
          dataSender?.close()
          collectorServer.forceShutdown()
          t.end()
        })
      }
    })
  })
})