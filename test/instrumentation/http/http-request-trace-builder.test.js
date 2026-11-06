/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const axios = require('axios')
const http = require('http')
const agent = require('../../support/agent-singleton-mock')
const HttpRequestTraceBuilder = require('../../../lib/instrumentation/http/http-request-trace-builder')
const TraceHeaderBuilder = require('../../../lib/instrumentation/http/trace-header-builder')
const TraceIdBuilder = require('../../../lib/context/trace/trace-id-builder')
const testConfig = require('../../fixtures/pinpoint-config-test.json')

const headers = {
  'Pinpoint-TraceID': new TraceIdBuilder(testConfig.agentId, Date.now().toString(), '99').build().toStringDelimiterFormatted(),
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
    .on('request', (req) => {
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
