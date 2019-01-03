const test = require('tape')
const axios = require('axios')

const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('agent')
const agent = new Agent(fixture.config)

const express = require('express')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

// close client connection
const testCompletions = new Map()
setInterval(() => {
  if (Array.from(testCompletions.values()).every(v => v)) {
    agent.dataSender.closeClient()
  }
}, 2000)

// send api meta info
agent.sendApiMetaInfo()

const testName1 = 'express1'
test(`${testName1} Should record request in basic route`, function (t) {
  const testName = testName1
  testCompletions.set(testName, false)

  t.plan(3)

  const PATH = '/'+testName
  const app = new express()

  app.get(PATH, (req, res) => {
    res.send('ok get')
  })
  app.post(PATH, (req, res) => {
    res.send('ok post')
  })

  const server = app.listen(TEST_ENV.port, async function () {
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

const testName2 = 'express2'
test(`[${testName2}] Should record request in express.Router`, function (t) {
  const testName = testName2
  testCompletions.set(testName, false)

  t.plan(3)

  const PATH = '/'+testName
  const app = new express()

  const router1 = express.Router()
  router1.get(PATH, (req, res) => {
    res.send('ok router1')
  })

  const router2 = express.Router()
  router2.get(PATH, async (req, res) => {
    await util.sleep(1000)
    res.send('ok router2')
  })

  app.use('/router1', router1)
  app.use('/router2', router2)

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(`/router1${PATH}`))
    t.ok(result1.status, 200)

    const result2 = await axios.get(getServerUrl(`/router2${PATH}`))
    t.ok(result2.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})


const testName3 = 'express3'
test(`${testName3} Should record request taking more than 2 sec`, function (t) {
  const testName = testName3
  testCompletions.set(testName, false)

  t.plan(2)

  const PATH = '/'+testName
  const app = new express()

  app.get(PATH, async (req, res) => {
      // slow outgoing call
    await axios.get('http://dummy.restapiexample.com/api/v1/employees')
    res.send('hello')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})

class MyError extends Error {
  constructor(message) {
    super(message)
    this.name = 'MyError'
  }
}
const testName4 = 'express4'
test.only(`${testName4} Should record internal error`, function (t) {
  const testName = testName4
  testCompletions.set(testName, false)

  t.plan(2)

  const PATH = '/' + testName
  const app = new express()

  app.get(PATH, async (req, res, next) => {
    console.log('[app] before ')
    try {
      const foo = null
      const bar = foo.noValue
    } catch (e) {
      next(e)
    }
    res.send('hello')
  })
  app.use((error, req, res, next) => {
    console.log('[app] error handler')
    res.json({ message: error.message });
    res.status = 500
  });

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 500)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})

const testName5 = 'express5'
test(`${testName5} Should record middleware`, function (t) {
  const testName = testName5
  testCompletions.set(testName, false)

  t.plan(2)

  const PATH = '/' + testName
  const app = new express()

  app.use((req, res, next) => {
    console.log('middleware1 : no path')
    next()
  })

  app.use(PATH, (req, res, next) => {
    console.log('middleware2 : matched path')
    next()
  })

  app.use(PATH + '/no', (req, res, next) => {
    console.log('middleware3 : not matched path')
    next()
  })

  app.get(PATH, (req, res) => {
    res.send('ok router1')
  })
  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})

const testName6 = 'express6'
test(`${testName6} Should record each http method`, function (t) {
  const testName = testName6
  testCompletions.set(testName, false)

  t.plan(6)

  const PATH = '/' + testName
  const app = new express()

  app.route(PATH)
    .get((req, res) => {
      res.send('ok get')
    })
    .post((req, res) => {
      res.send('ok post')
    })
    .put((req, res) => {
      res.send('ok put')
    })
    .patch((req, res) => {
      res.send('ok patch')
    })
    .delete((req, res) => {
      res.send('ok delete')
    })

  const server = app.listen(TEST_ENV.port, async function () {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    const result2 = await axios.post(getServerUrl(PATH))
    t.ok(result2.status, 200)

    const result3 = await axios.put(getServerUrl(PATH))
    t.ok(result3.status, 200)

    const result4 = await axios.patch(getServerUrl(PATH))
    t.ok(result4.status, 200)

    const result5 = await axios.delete(getServerUrl(PATH))
    t.ok(result5.status, 200)

    const traceMap = agent.traceContext.getAllTraceObject()
    log.debug(traceMap.size)
    t.ok(traceMap.size > 0)

    server.close()
    testCompletions.set(testName, true)
  })
})
