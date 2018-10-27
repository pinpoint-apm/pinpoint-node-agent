const Agent = require('../../../src/agent')
const agent = new Agent()

const test = require('tape')
const axios = require('axios')

function startServer() {
  const express = require('express')
  return new express()
}

test('Should record a span event with start time', function (t) {
  t.plan(2)

  const app = startServer()
  app.get('/test', function (req, res) {
    res.send('hello')
  })

  const server = app.listen(5005, async function () {
    const beforeApiCall = Date.now()
    await axios.get('http://localhost:5005/test')
    t.ok(agent.traceContext.spanEventRecorder.spanEvent)
    t.ok(agent.traceContext.spanEventRecorder.spanEvent.startTime > beforeApiCall)
    server.close()
  })
})

