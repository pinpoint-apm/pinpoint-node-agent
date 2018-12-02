const test = require('tape')
const axios = require('axios')

const fixture = require('../fixture')
fixture.config.enabledDataSending = true

const Agent = require('agent')
const agent = new Agent(fixture.config)

const Trace = require('context/trace')
const DataSender = require('sender/data-sender')
const dataSender = new DataSender(fixture.config)


test('Should send span', function (t) {
  t.plan(1)

  const traceId = fixture.getTraceId()
  const agentInfo = fixture.getAgentInfo()
  const trace = new Trace(traceId, agentInfo)
  const spanEventRecorder1 = trace.traceBlockBegin()

  trace.traceBlockEnd(spanEventRecorder1)
  const span = trace.spanRecorder.span

  dataSender.sendSpan(span)

  t.ok(dataSender)
})

function startServer() {
  const express = require('express')
  return new express()
}

test.only('Should send request on express server', function (t) {
  t.plan(1)

  const app = startServer()

  const path = '/test'
  app.get(path, function (req, res) {
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    await axios.get('http://localhost:5005' + path)
    t.ok(agent)
    // server.close()
  })
})
