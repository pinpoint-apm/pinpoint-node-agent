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

test('Should create new trace by request', function (t) {
  t.plan(1)

  const app = startServer()

  const path = '/test'
  app.get(path, function (req, res) {
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
//
// test('Should record spanEvent', function (t) {
//   t.plan(2)
//
//   const app = startServer()
//
//   const path = '/test'
//   app.get(path, function (req, res) {
//     res.send('hello')
//   })
//
//   const server = app.listen(5005, async function () {
//     await axios.get('http://localhost:5005' + path)
//
//     const traceMap = agent.traceContext.getAllTraceObject()
//     const trace = Array.from(traceMap.values()).find(v => v.spanRecorder && v.spanRecorder.span.rpc === path)
//     const span = trace.spanRecorder.span
//     t.ok(span.spanEventList.length > 0)
//     t.ok(span.spanEventList.some(r => r.serviceType.code === ServiceTypeCode.express))
//
//     server.close()
//   })
// })
