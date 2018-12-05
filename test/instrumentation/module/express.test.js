const test = require('tape')
const axios = require('axios')

const fixture = require('../../fixture')
fixture.config.enabledDataSending = true

const Agent = require('agent')
const agent = new Agent(fixture.config)

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

function startServer() {
  const express = require('express')
  return new express()
}

test('Should create new trace with outgoing api call', function (t) {
  t.plan(1)

  const app = startServer()

  const path = '/test'
  app.get(path, async (req, res) => {
    // setTimeout(async () => {
      // slow outgoing call
      await axios.get('http://dummy.restapiexample.com/api/v1/employees')
    // }, 5000)
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
  })
})

test('Should record exception', function (t) {
  t.plan(1)

  const app = startServer()

  const path = '/test'
  app.get(path, async (req, res, next) => {
    try {
      const foo = null
      const bar = foo.no.value
    } catch (e) {
      next(e)
    }
    res.send('hello')
  })
  app.use((error, req, res, next) => {
    console.log('============================= error handling middleware')
    res.json({ message: error.message });
  });


  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)

    const traceMap = agent.traceContext.getAllTraceObject()
    t.ok(traceMap.size > 0)

    server.close()
  })
})
