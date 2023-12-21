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
const express = require('express')

const headers = {
  'Pinpoint-TraceID': fixture.getTraceId().transactionId.toString(),
  'Pinpoint-SpanID': 2,
  'Pinpoint-pSpanID': 3,
}
const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should read pinpoint header', async function (t) {
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
    t.end()
  })
})

test('Should write pinpoint header', async function (t) {
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
    t.end()
  })
})

test('nested request HTTP', async function (t) {
  const app = new express()

  let actualAssertsOn5006
  let actualTransactionIdSequence
  app.get('/test', async (req, res) => {
    await axios.get(`http://localhost:5006/test`)
    res.send('ok')
    agent.callbackTraceClose((trace) => {
      const actualRequestData = RequestHeaderUtils.read(req)
      t.equal(actualRequestData.endPoint, 'localhost:5005', 'http://localhost:5005/test endPoint')
      t.equal(actualRequestData.flags, null, 'http://localhost:5005/test flags')
      t.equal(actualRequestData.host, null, 'http://localhost:5005/test host')
      t.equal(actualRequestData.isRoot, true, 'http://localhost:5005/test isRoot')
      t.equal(actualRequestData.parentApplicationName, null, 'http://localhost:5005/test parentApplicationName')
      t.equal(actualRequestData.parentApplicationType, null, 'http://localhost:5005/test parentApplicationType')
      t.equal(actualRequestData.parentSpanId, null, 'http://localhost:5005/test parentSpanId')
      // t.equal(actualRequestData.remoteAddress, '127.0.0.1', 'http://localhost:5005/test remoteAddress')
      t.equal(actualRequestData.rpcName, '/test', 'http://localhost:5005/test rpcName')
      t.equal(actualRequestData.sampled, null, 'http://localhost:5005/test sampled')
      t.equal(actualRequestData.spanId, null, 'http://localhost:5005/test spanId')
      t.equal(actualRequestData.transactionId, null, 'http://localhost:5005/test transactionId')

      const actualTraceOn5005 = localStorage.getStore()
      if (actualTransactionIdSequence === undefined) {
        actualTransactionIdSequence = trace.traceId.transactionId.sequence
      }
      t.equal(actualTransactionIdSequence, trace.traceId.transactionId.sequence, `http://localhost:5005/test transactionId sequence is ${actualTransactionIdSequence}`)

      actualAssertsOn5006(actualTraceOn5005)

      actualTransactionIdSequence = String(parseInt(actualTransactionIdSequence) + 1)
    })
  })

  const server = app.listen(5005, async function() {
    await axios.get(`http://localhost:5005/test`)
    await axios.get(`http://localhost:5005/test`)
    await axios.get(`http://localhost:5005/test`)
    await axios.get(`http://localhost:5005/test`)
    await axios.get(`http://localhost:5005/test`)
    t.end()
    serverGraphQL.close()
    server.close()
  })

  const appGraphQL = new express()
  appGraphQL.get('/test', (req, res) => {
    res.send('ok')

    const actualTraceOn5006 = localStorage.getStore()
    actualAssertsOn5006 = (actualTraceOn5005) => {
      const actualRequestData = RequestHeaderUtils.read(req)
      t.equal(actualRequestData.endPoint, 'localhost:5006', 'http://localhost:5006/test endPoint')
      t.equal(actualRequestData.flags, 0, 'http://localhost:5006/test flags')
      t.equal(actualRequestData.host, 'localhost:5006', 'http://localhost:5006/test host')
      t.equal(actualRequestData.isRoot, false, 'http://localhost:5006/test isRoot')
      t.equal(actualRequestData.parentApplicationName, 'node.test.app', 'http://localhost:5006/test parentApplicationName')
      t.equal(actualRequestData.parentApplicationType, 1400, 'http://localhost:5006/test parentApplicationType')
      t.equal(actualRequestData.parentSpanId, actualTraceOn5005.traceId.spanId, 'http://localhost:5006/test parentSpanId')
      // t.equal(actualRequestData.remoteAddress, '127.0.0.1', 'http://localhost:5006/test remoteAddress')
      t.equal(actualRequestData.rpcName, '/test', 'http://localhost:5006/test rpcName')
      t.equal(actualRequestData.sampled, true, 'http://localhost:5006/test sampled')
      t.equal(actualRequestData.spanId, actualTraceOn5006.traceId.spanId, 'http://localhost:5006/test spanId')
      t.equal(actualRequestData.transactionId.toString(), actualTraceOn5006.traceId.transactionId.toString(), 'http://localhost:5006/test transactionId')
      t.equal(actualTraceOn5006.traceId.transactionId.sequence, actualTransactionIdSequence, `http://localhost:5006/test transactionId sequence is ${actualTransactionIdSequence}`)
    }
  })

  const serverGraphQL = appGraphQL.listen(5006)
})
