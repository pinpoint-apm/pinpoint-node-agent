const test = require('tape')
const axios = require('axios')
const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()


const Agent = require('agent')
const agent = new Agent(fixture.config)

function startServer() {
  const express = require('express')
  return new express()
}

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

// close client connection
setTimeout(() => agent.dataSender.closeClient(), 4000)

// send api meta info
agent.sendApiMetaInfo()

test('Should record a request taking more than 2 sec', function (t) {
  t.plan(2)

  const PATH = '/express/test'
  const app = startServer()
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
  })
})

test('Should record a request with internal error', function (t) {
  t.plan(2)

  const PATH = '/express/test/error'
  const app = startServer()
  app.get(PATH, async (req, res, next) => {
    try {
      const foo = null
      const bar = foo.noValue
    } catch (e) {
      next(e)
    }
    res.send('hello')
  })
  app.use((error, req, res, next) => {
    res.json({ message: error.message });
    res.status = 500
  });

  const server = app.listen(TEST_ENV.port, async function () {
    const result = await axios.get(getServerUrl(PATH))
    t.ok(result.status, 500)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
  })
})
