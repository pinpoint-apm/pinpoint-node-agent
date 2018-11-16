const Agent = require('agent')
const agent = new Agent({
  agentId: 'agent-for-dev',
  applicationName: 'test web application'
})

const test = require('tape')
const axios = require('axios')

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
    await axios.get('http://localhost:5005/test')
    t.ok(agent.traceContext.getTraceObjectCount() > 0)
    t.ok(Array.from(agent.traceContext.traceObjectMap.values())
        .find(v => v.spanRecorder.span.rpc === path))
    server.close()
  })
})
