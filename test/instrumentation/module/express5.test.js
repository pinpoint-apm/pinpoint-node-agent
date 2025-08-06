/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const axios = require('axios')
const annotationKey = require('../../../lib/constant/annotation-key')
const apiMetaService = require('../../../lib/context/api-meta-service')
const MethodDescriptorBuilder = require('../../../lib/context/method-descriptor-builder')

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
  host: 'localhost', port: 5007
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

const testName1 = 'express5-basic'
test(`${testName1} Should record request in Express 5 basic route`, function (t) {
  agent.bindHttp()

  const testName = testName1
  const PATH = '/' + testName
  const app = express5()

  // Express 5 GET route with async/await support
  app.get(PATH, async (req, res) => {
    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_PARAM.code, 'HTTP param key match')
      t.equal(trace.spanBuilder.annotations[0].value, 'api=test&test1=express5', 'HTTP param value match')
      t.equal(trace.spanBuilder.annotations[1].key, annotationKey.HTTP_STATUS_CODE.code, 'HTTP status code')
      t.equal(trace.spanBuilder.annotations[1].value, 200, 'response status is 200')

      let actualBuilder = new MethodDescriptorBuilder('get')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor, 'Router.get', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'get', 'methodName')
    })
    // Express 5 natively supports Promises
    await new Promise(resolve => setTimeout(resolve, 10))
    res.send('ok get express5')
  })

  // Express 5 POST route
  app.post(PATH, async (req, res) => {
    res.send('ok post express5')

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'POST HTTP STATUS CODE')
      t.equal(trace.spanBuilder.annotations[0].value, 200, 'POST HTTP STATUS CODE value')

      let actualBuilder = new MethodDescriptorBuilder('post')
        .setClassName('Router')
      const actualMethodDescriptor = apiMetaService.cacheApiWithBuilder(actualBuilder)
      let spanEvent = trace.spanBuilder.spanEventList[0]
      t.equal(actualMethodDescriptor.apiId, spanEvent.apiId, 'apiId')
      t.true(actualMethodDescriptor.apiDescriptor, 'Router.post', 'apiDescriptor')
      t.equal(actualMethodDescriptor.className, 'Router', 'className')
      t.equal(actualMethodDescriptor.methodName, 'post', 'methodName')
    })
  })

  // Express 5 error handling with async/await
  app.get('/express5-error', async (req, res, next) => {
    try {
      // In Express 5, errors thrown in async functions are automatically passed to error handlers
      throw new Error('Express 5 async error')
    } catch (error) {
      next(error)
    }
  })

  // Error handler
  app.use(function (err, req, res, next) {
    // eslint-disable-next-line no-unused-vars
    const _ = next // Express error handler requires 4 parameters

    agent.callbackTraceClose((trace) => {
      t.equal(trace.spanBuilder.annotations[0].key, annotationKey.HTTP_STATUS_CODE.code, 'Error HTTP STATUS CODE')
      t.equal(trace.spanBuilder.annotations[0].value, 500, 'Error HTTP STATUS CODE value')
    })

    res.status(500).send('Express 5 error handled!')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    try {
      // GET request test
      const result1 = await axios.get(getServerUrl(PATH) + '?api=test&test1=express5')
      t.equal(result1.status, 200, 'GET request successful')
      t.equal(result1.data, 'ok get express5', 'GET response data')

      // POST request test
      const result2 = await axios.post(getServerUrl(PATH))
      t.equal(result2.status, 200, 'POST request successful')
      t.equal(result2.data, 'ok post express5', 'POST response data')

      // Error handling test
      try {
        await axios.get(getServerUrl('/express5-error'))
      } catch (error) {
        t.equal(error.response.status, 500, 'Error handling works')
        t.equal(error.response.data, 'Express 5 error handled!', 'Error response data')
      }

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
  agent.bindHttp()

  const app = express5()
  const router = express5.Router()

  // Add async route to Router
  router.get('/test', async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 5))
    res.json({ message: 'Express 5 Router works', version: '5.x' })
  })

  app.use('/api', router)

  const server = app.listen(5008, async () => {
    try {
      const result = await axios.get('http://localhost:5008/api/test')
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
