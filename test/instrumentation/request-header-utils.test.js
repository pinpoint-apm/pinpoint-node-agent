/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const http = require('http')
const { fixture } = require('../test-helper')
const RequestHeaderUtils = require('../../lib/instrumentation/request-header-utils')
const agent = require('../support/agent-singleton-mock')
const PinpointHeader = require('../../lib/constant/http-header').PinpointHeader
const localStorage = require('../../lib/instrumentation/context/local-storage')

const headers = {
  'Pinpoint-TraceID': fixture.getTraceId().transactionId.toString(),
  'Pinpoint-SpanID': 2,
  'Pinpoint-pSpanID': 3,
}
const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should read pinpoint header', async function (t) {
  t.plan(3)

  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('hello')
  })
  .on('request', (req, res) => {
    const requestData = RequestHeaderUtils.read(req)
    t.equal(requestData.endPoint, endPoint)
    t.equal(requestData.rpcName, rpcName)
    t.ok(requestData.transactionId)
  })
  .listen(5005, async function() {
    await axios.get(`http://${endPoint}${rpcName}?q=1`, { headers })
    server.close()
  })
})

test('Should write pinpoint header', async function (t) {
  t.plan(1)

  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('hello')
  })
  .on('request', (req, res) => {
    const trace = agent.createTraceObject()
    localStorage.run(trace, () => {
      const writtenReq = RequestHeaderUtils.write(req, agent)
      t.equal(writtenReq.headers[PinpointHeader.HTTP_TRACE_ID], trace.traceId.transactionId.toString(), "trace ID new ID was added in Header")
    })
  })
  .listen(5005, async function() {
    await axios.get(`http://${endPoint}${rpcName}?q=1`)
    server.close()
  })
})
