/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const http = require('http')
const https = require('https')
const agent = require('../support/agent-singleton-mock')
const localStorage = require('../../lib/instrumentation/context/local-storage')
const express = require('express')
const HttpRequestTraceBuilder = require('../../lib/instrumentation/http/http-request-trace-builder')
const TraceHeaderBuilder = require('../../lib/instrumentation/http/trace-header-builder')
const Header = require('../../lib/instrumentation/http/pinpoint-header')
const HttpClientRequest = require('../../lib/instrumentation/http/http-client-request')
const OutgoingClientRequestHeaderWriter = require('../../lib/instrumentation/http/outgoing-client-request-header-writer')
const fixture = require('../fixture')

const headers = {
  'Pinpoint-TraceID': fixture.getTraceId().transactionId.toString(),
  'Pinpoint-SpanID': 2,
  'Pinpoint-pSpanID': 3,
}
const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should read pinpoint header', async function (t) {
  agent.bindHttp()
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('hello')
  })
    .on('request', (req, res) => {
      const requestTraceBuilder = new HttpRequestTraceBuilder(agent.getTraceContext(), req)
      const requestTrace = requestTraceBuilder.build()
      const traceHeader = new TraceHeaderBuilder(requestTraceBuilder.request).build()
      t.equal(requestTraceBuilder.request.request.headers['host'], endPoint)
      t.equal(requestTrace.rpcName, rpcName)
      t.ok(traceHeader.getTraceId())
    })
    .listen(5005, async function () {
      await axios.get(`http://${endPoint}${rpcName}?q=1`, { headers })
      server.close()
      t.end()
    })
})

test('Should write pinpoint header', async function (t) {
  agent.bindHttp()
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('hello')
  })
    .on('request', (req, res) => {
      const trace = agent.createTraceObject()
      localStorage.run(trace, () => {
        const clientRequest = new HttpClientRequest(req)
        const request = clientRequest.request
        clientRequest.getHeader = (name) => {
          return request.headers[name]
        }
        clientRequest.setHeader = (name, value) => {
          request.headers[name] = value
        }
        const nextTraceId = trace.getTraceId().getNextTraceId()
        const headerWriter = new OutgoingClientRequestHeaderWriter(clientRequest)
        headerWriter.write(nextTraceId, agent.getAgentInfo())
        t.equal(request.headers[Header.traceId], trace.spanBuilder.traceRoot.getTraceId().toStringDelimiterFormatted(), "trace ID new ID was added in Header")
      })
    })
    .listen(5005, async function () {
      await axios.get(`http://${endPoint}${rpcName}?q=1`, {
        timeout: 1000,
        httpAgent: new http.Agent({ keepAlive: false }),
        httpsAgent: new https.Agent({ keepAlive: false }),
      })
      server.close()
      t.end()
    })
})

test('nested request HTTP', async function (t) {
  agent.bindHttp()
  const app = new express()

  let actualAssertsOn5006
  let actualTransactionIdSequence
  app.get('/test', async (req, res) => {
    await axios.get(`http://localhost:5006/test`)
    res.send('ok')
    agent.callbackTraceClose((trace) => {
      t.equal(req.headers['host'], 'localhost:5005', 'http://localhost:5005/test endPoint')

      const actualTraceOn5005 = localStorage.getStore()
      if (actualTransactionIdSequence === undefined) {
        actualTransactionIdSequence = trace.spanBuilder.traceRoot.getTraceId().transactionId
      }
      t.equal(actualTransactionIdSequence, trace.spanBuilder.traceRoot.getTraceId().transactionId, `http://localhost:5005/test transactionId sequence is ${actualTransactionIdSequence}`)

      actualAssertsOn5006(actualTraceOn5005)

      actualTransactionIdSequence = String(parseInt(actualTransactionIdSequence) + 1)
    })
  })

  const appGraphQL = new express()
  appGraphQL.get('/test', (req, res) => {
    res.send('ok')

    const actualTraceOn5006 = localStorage.getStore()
    actualAssertsOn5006 = (actualTraceOn5005) => {
      const requestTraceBuilder = new HttpRequestTraceBuilder(agent.getTraceContext(), req)
      const requestTrace = requestTraceBuilder.build()
      const traceHeader = new TraceHeaderBuilder(requestTraceBuilder.request).build()
      const traceId = traceHeader.getTraceId()
      t.equal(req.headers['host'], 'localhost:5006', 'http://localhost:5006/test endPoint')
      t.equal(traceId.flags, 0, 'http://localhost:5006/test flags')
      t.equal(traceHeader.host, 'localhost:5006', 'http://localhost:5006/test host')
      t.equal(traceHeader.parentApplicationName, agent.getAgentInfo().getApplicationName(), 'http://localhost:5006/test parentApplicationName')
      t.equal(traceHeader.parentApplicationType, 1400, 'http://localhost:5006/test parentApplicationType')
      t.equal(traceId.parentSpanId, actualTraceOn5005.spanBuilder.traceRoot.getTraceId().spanId, 'http://localhost:5006/test parentSpanId')
      // t.equal(actualRequestData.remoteAddress, '127.0.0.1', 'http://localhost:5006/test remoteAddress')
      t.equal(requestTrace.rpcName, '/test', 'http://localhost:5006/test rpcName')
      t.equal(traceHeader.sampled, undefined, 'http://localhost:5006/test header sampled')
      t.equal(traceId.spanId, actualTraceOn5006.getTraceId().spanId, 'http://localhost:5006/test spanId')
      t.deepEqual(traceId, actualTraceOn5006.getTraceId(), 'http://localhost:5006/test transactionId')
      t.equal(actualTraceOn5006.getTraceId().getTransactionId(), actualTransactionIdSequence, `http://localhost:5006/test transactionId sequence is ${actualTransactionIdSequence}`)
    }
  })

  const serverGraphQL = appGraphQL.listen(5006, () => {
    const server = app.listen(5005, async function () {
      await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
      await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
      await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
      await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
      await axios.get(`http://localhost:5005/test`, { httpAgent: new http.Agent({ keepAlive: false }) })
      t.end()
      serverGraphQL.close()
      server.close()
    })
  })
})
