const Agent = require('agent')
const agent = new Agent({
  agentId: 'agent-for-dev',
  applicationName: 'test web application'
})

const test = require('tape')
const axios = require('axios')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

function startServer() {
  const express = require('express')
  return new express()
}

test('Should create new trace by request', function (t) {
  t.plan(2)

  const app = startServer()

  const path = '/test'
  app.get(path, function (req, res) {
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)

    const traceMap = agent.traceContext.traceObjectMap
    t.ok(traceMap.size > 0)
    t.ok(Array.from(traceMap.values()).some(v => v.spanRecorder.span.rpc === path))

    server.close()
  })
})

test('Should record spanEvent', function (t) {
  t.plan(2)

  const app = startServer()

  const path = '/test'
  app.get(path, function (req, res) {
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)

    const traceMap = agent.traceContext.traceObjectMap
    const trace = Array.from(traceMap.values()).find(v => v.spanRecorder.span.rpc === path)
    const span = trace.spanRecorder.span
    t.ok(span.spanEventList.length > 0)
    t.ok(span.spanEventList.some(r => r.serviceType.code === ServiceTypeCode.express))

    server.close()
  })
})
