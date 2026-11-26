/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { ProcessAgentBuilder, startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
const agent = startAgent()
const axios = require('axios')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')
const RecordingDataSender = require('../../support/recording-data-sender')
const ServiceType = require('../../../lib/context/service-type')
const defaultPredefinedMethodDescriptorRegistry = require('../../../lib/constant/default-predefined-method-descriptor-registry')
const http = require('http')
const { once } = require('node:events')

// Set up express5 hooking before requiring
const { Hook } = require('require-in-the-middle')
const path = require('path')
const expressHook = require(path.resolve(__dirname, '../../../lib/instrumentation/module/express.js'))

// Create a hook specifically for express5
const express5Hook = new Hook(['express5'], (exports, name, basedir) => {
  if (name === 'express5') {
    // Get version from package.json
    const fs = require('fs')
    let version = '5.0.0' // Default fallback
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(basedir, 'package.json')))
      version = packageJson.version
    } catch (e) {
      // Use fallback version
    }

    // Apply the express hook to express5
    expressHook(agent, version, exports)
  }
  return exports
})

let express5 = require('express5')

const TEST_ENV = {
  host: '127.0.0.1', port: 0
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'express5-basic'
test(`${testName1} Should record request in Express 5 basic route`, function (t) {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  const testName = testName1
  const PATH = '/' + testName
  const app = express5()

  // Express 5 GET route with async/await support
  let getTraceRoot
  app.get(PATH, async (req, res) => {
    getTraceRoot = agent.currentTraceObject().getTraceRoot()
    // Express 5 natively supports Promises
    await new Promise(resolve => setTimeout(resolve, 10))
    res.send('ok get express5')
  })

  // Express 5 POST route
  let postTraceRoot
  app.post(PATH, async (req, res) => {
    postTraceRoot = agent.currentTraceObject().getTraceRoot()
    res.send('ok post express5')
  })

  // Express 5 passes the rejected promise of an async route to the error handler
  let errorTraceRoot
  app.get('/express5-error', async () => {
    errorTraceRoot = agent.currentTraceObject().getTraceRoot()
    throw new Error('Express 5 async error')
  })

  // Error handler
  app.use(function (err, req, res, next) {
    // eslint-disable-next-line no-unused-vars
    const _ = next // Express error handler requires 4 parameters

    res.status(500).send('Express 5 error handled!')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    TEST_ENV.port = server.address().port
    try {
      // GET request test
      const result1 = await axios.get(getServerUrl(PATH) + '?api=test&test1=express5')
      t.equal(result1.status, 200, 'GET request successful')
      t.equal(result1.data, 'ok get express5', 'GET response data')

      const getSpan = await dataSender.waitForSpan(getTraceRoot)
      t.equal(getSpan.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
      t.equal(getSpan.annotations[0].value, 'api=test&test1=express5', 'HTTP param value match')
      t.equal(getSpan.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
      t.equal(getSpan.annotations[1].value, 200, 'response status is 200')

      let actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router'))
      t.equal(actualMethodDescriptor.apiId, getSpan.spanEventList[0].apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')

      // POST request test
      const result2 = await axios.post(getServerUrl(PATH))
      t.equal(result2.status, 200, 'POST request successful')
      t.equal(result2.data, 'ok post express5', 'POST response data')

      const postSpan = await dataSender.waitForSpan(postTraceRoot)
      t.equal(postSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'POST HTTP STATUS CODE')
      t.equal(postSpan.annotations[0].value, 200, 'POST HTTP STATUS CODE value')

      actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('post').setClassName('Router'))
      t.equal(actualMethodDescriptor.apiId, postSpan.spanEventList[0].apiId, 'apiId')
      t.equal(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')

      // Error handling test
      try {
        await axios.get(getServerUrl('/express5-error'))
      } catch (error) {
        if (error.response) {
            t.equal(error.response.status, 500, 'Error handling works')
            t.equal(error.response.data, 'Express 5 error handled!', 'Error response data')
        } else {
            throw error
        }
      }

      const errorSpan = await dataSender.waitForSpan(errorTraceRoot)
      t.equal(errorSpan.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'Error HTTP STATUS CODE')
      t.equal(errorSpan.annotations[0].value, 500, 'Error HTTP STATUS CODE value')
      const errorHandlerSpanEvent = errorSpan.spanEventList[1]
      t.equal(errorHandlerSpanEvent.apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('use').setClassName('Router')).apiId, 'the error handler is Router.use')
      t.equal(errorHandlerSpanEvent.depth, 1, 'the error handler is a sibling of Router.get that rejected')
      t.true(/^Error: Express 5 async error .*express5\.test\.js:\d+:\d+$/.test(errorHandlerSpanEvent.exceptionInfo.stringValue), 'the error handler records the error of the rejected promise')

    } catch (error) {
      t.fail(`Test failed: ${error.message}`)
    } finally {
      t.end()
      server.close()
    }
  })
})

// Express 5 Router test
test('Express 5 Router functionality', (t) => {
  nullDataSenderAgent()

  const app = express5()
  const router = express5.Router()

  // Add async route to Router
  router.get('/test', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 5))
    res.json({ message: 'Express 5 Router works', version: '5.x' })
  })

  app.use('/api', router)

  const server = app.listen(0, async () => {
    const port = server.address().port
    try {
      const result = await axios.get(`http://localhost:${port}/api/test`)
      t.equal(result.status, 200, 'Router request successful')
      t.equal(result.data.message, 'Express 5 Router works', 'Router response data')
      t.equal(result.data.version, '5.x', 'Router version data')
    } catch (error) {
      t.fail(`Router test failed: ${error.message}`)
    } finally {
      t.end()
      server.close()
    }
    express5Hook.unhook()
  })
})

test('Express 5: a route handler runs in its own Asynchronous Invocation, so the fetch() calls after each await stay under Router.get', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = express5()
  app.get('/users', async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    await (await fetch(targetUrl)).text()
    res.send('ok')
  })
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

test('Express 5: a middleware handler runs in its own Asynchronous Invocation, and the route after its next() stays a sibling', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()
  const targetServer = http.createServer((req, res) => res.end('target')).listen(0)
  await once(targetServer, 'listening')
  const targetUrl = `http://localhost:${targetServer.address().port}/`

  let traceRoot
  const app = express5()
  app.use('/users', async (req, res, next) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 10))
    await (await fetch(targetUrl)).text()
    next()
  })
  app.get('/users', (req, res) => {
    res.send('ok')
  })
  const server = app.listen(0)
  await once(server, 'listening')
  await (await fetch(`http://localhost:${server.address().port}/users`)).text()
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()
  targetServer.close()

  t.equal(span.spanEventList.length, 2, 'the PSpan has Router.use and Router.get')
  const [middlewareSpanEvent, routeSpanEvent] = span.spanEventList
  t.equal(middlewareSpanEvent.depth, 1, 'Router.use is at depth 1')
  t.equal(routeSpanEvent.depth, 1, 'Router.get after next() is at depth 1 next to Router.use')

  const middlewareSpanEvents = dataSender.findAsyncInvocationSpanEvents(middlewareSpanEvent)
  t.equal(middlewareSpanEvents.length, 2, 'the Asynchronous Invocation of Router.use has the fetch() span event')
  const [middlewareAsyncInvocation, fetchA] = middlewareSpanEvents
  t.equal(middlewareAsyncInvocation.apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.use starts with the Asynchronous Invocation')
  t.equal(fetchA.serviceType, ServiceType.asyncHttpClientInternal.getCode(), 'fetch a is the fetch() after the await of the middleware')
  t.equal(fetchA.depth, 2, 'fetch a is at depth 2 under the Asynchronous Invocation of Router.use')

  const routeSpanEvents = dataSender.findAsyncInvocationSpanEvents(routeSpanEvent)
  t.equal(routeSpanEvents.length, 1, 'the Asynchronous Invocation of Router.get has no call')
  t.equal(routeSpanEvents[0].apiId, defaultPredefinedMethodDescriptorRegistry.asyncInvocationDescriptor.apiId, 'the SpanChunk linked by the asyncEvent of Router.get is the Asynchronous Invocation')
  t.end()
})

test('Express 5: a route of a mounted sub-app runs in the Asynchronous Invocation of the sub-app and records its URI template', async (t) => {
  const dataSender = new RecordingDataSender()
  const agent = new ProcessAgentBuilder().setDataSender(dataSender).build()

  let traceRoot
  const admin = express5()
  admin.get('/users/:id', async (req, res) => {
    traceRoot = agent.currentTraceObject().getTraceRoot()
    await new Promise(resolve => setTimeout(resolve, 5))
    res.send('ok')
  })
  const app = express5()
  app.use('/admin', admin)
  const server = app.listen(0)
  await once(server, 'listening')
  const response = await fetch(`http://localhost:${server.address().port}/admin/users/1`)
  t.equal(response.status, 200, 'the sub-app route responds 200')
  t.equal(await response.text(), 'ok', 'the sub-app route sends its body')
  const span = await dataSender.waitForSpan(traceRoot)
  server.close()

  t.equal(span.spanEventList.length, 1, 'the PSpan has only the Router.use of the sub-app')
  const subAppSpanEvents = dataSender.findAsyncInvocationSpanEvents(span.spanEventList[0])
  t.equal(subAppSpanEvents[1].apiId, apiMetaService.cacheApiWithBuilder(new MethodDescriptorBuilder('get').setClassName('Router')).apiId, 'the Router.get of the sub-app route is in the Asynchronous Invocation of the sub-app')
  t.equal(subAppSpanEvents[1].depth, 2, 'the Router.get of the sub-app route is at depth 2 under that Asynchronous Invocation')
  t.equal(span.traceRoot.getEnricher('uriStats.uriTemplate'), '/users/:id', 'the URI template of the sub-app route is recorded on the TraceRoot')
  t.end()
})
