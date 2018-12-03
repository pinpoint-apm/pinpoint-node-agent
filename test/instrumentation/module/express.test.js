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

test('Should create new trace by request', function (t) {
  t.plan(1)

  const app = startServer()

  const path = '/test'
  app.get(path, async (req, res) => {
    // slow external call
    await axios.get('http://dummy.restapiexample.agentcom/api/v1/employees')
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)

    const traceMap = agent.traceContext.getAllTraceObject()
    // console.log('traceMap', traceMap)
    t.ok(traceMap.size > 0)

    server.close()
  })
})
