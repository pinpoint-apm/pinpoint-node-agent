/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const { startAgent, nullDataSenderAgent } = require('../../support/process-agent-builder')
startAgent()
const axios = require('axios')
const http = require('http')
const HttpRequestTraceBuilder = require('../../../lib/instrumentation/http/http-request-trace-builder')
const TraceHeaderBuilder = require('../../../lib/instrumentation/http/trace-header-builder')
const TraceIdBuilder = require('../../../lib/context/trace/trace-id-builder')
const testConfig = require('../../fixtures/pinpoint-config-test.json')
const { ParentTraceHeader } = require('../../fixtures/parent-trace-header')

const headers = {
  'Pinpoint-TraceID': new TraceIdBuilder(testConfig.agentId, Date.now().toString(), '99').build().toStringDelimiterFormatted(),
  'Pinpoint-SpanID': 2,
  'Pinpoint-pSpanID': 3,
}
const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should read pinpoint header', async function (t) {
  const agent = nullDataSenderAgent()
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

test('Pinpoint headers continue the parent trace', function (t) {
  const agent = nullDataSenderAgent()
  const traceHeader = readTraceHeader(agent, ParentTraceHeader.header('pinpoint-host', 'parent.host:5006'))

  t.equal(traceHeader.getTraceId().getAgentId(), 'parent.agent', 'agentId is the Pinpoint-TraceID agentId')
  t.equal(traceHeader.getTraceId().getAgentStartTime(), '1599831487121', 'agentStartTime is the Pinpoint-TraceID agentStartTime')
  t.equal(traceHeader.getTraceId().getTransactionId(), '4', 'transactionId is the Pinpoint-TraceID sequence')
  t.equal(traceHeader.getTraceId().getSpanId(), '-387300102333636357', 'spanId is the Pinpoint-SpanID')
  t.equal(traceHeader.getTraceId().getParentSpanId(), '3116250228920588432', 'parentSpanId is the Pinpoint-pSpanID')
  t.equal(traceHeader.getTraceId().getFlags(), 0, 'flags is the Pinpoint-Flags')
  t.equal(traceHeader.getParentApplicationName(), 'parent.application', 'parentApplicationName is the Pinpoint-pAppName')
  t.equal(traceHeader.getParentApplicationType(), 1210, 'parentApplicationType is the Pinpoint-pAppType')
  t.equal(traceHeader.getHost(), 'parent.host:5006', 'host is the Pinpoint-Host')
  t.equal(traceHeader.getParentServiceName(), undefined, 'parentServiceName is unset without Pinpoint-pServiceName')
  t.end()
})

test('Pinpoint-Sampled s0 disables the trace and other values continue the parent trace', function (t) {
  const agent = nullDataSenderAgent()

  t.ok(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-sampled', 's0')).isDisable(), 's0 disables the trace')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-sampled', 's1')).getTraceId().getAgentId(), 'parent.agent', 's1 continues the parent trace')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-sampled', 'S0')).getTraceId().getAgentId(), 'parent.agent', 'S0 continues the parent trace')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-sampled', '')).getTraceId().getAgentId(), 'parent.agent', 'an empty value continues the parent trace')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-sampled', 'abc')).getTraceId().getAgentId(), 'parent.agent', 'abc continues the parent trace')
  t.end()
})

test('Pinpoint-TraceID, Pinpoint-SpanID or Pinpoint-pSpanID that is empty or not delimited starts a new trace', function (t) {
  const agent = nullDataSenderAgent()

  t.ok(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-traceid', '')).isNewTrace(), 'an empty Pinpoint-TraceID starts a new trace')
  t.ok(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-traceid', 'parent.agent')).isNewTrace(), 'a Pinpoint-TraceID without ^ delimiters starts a new trace')
  t.ok(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-spanid', '')).isNewTrace(), 'an empty Pinpoint-SpanID starts a new trace')
  t.ok(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-pspanid', '')).isNewTrace(), 'an empty Pinpoint-pSpanID starts a new trace')
  t.end()
})

test('Pinpoint-Flags is the parent trace flags', function (t) {
  const agent = nullDataSenderAgent()

  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-flags', '1')).getTraceId().getFlags(), 1, 'Pinpoint-Flags 1 is flags 1')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-flags', 'abc')).getTraceId().getFlags(), 0, 'Pinpoint-Flags abc is flags 0')
  t.end()
})

test('Pinpoint-pAppName and Pinpoint-pAppType are the parent application', function (t) {
  const agent = nullDataSenderAgent()

  const withoutParentApplicationName = readTraceHeader(agent, ParentTraceHeader.header('pinpoint-pappname', ''))
  t.equal(withoutParentApplicationName.getParentApplicationName(), undefined, 'an empty Pinpoint-pAppName leaves parentApplicationName unset')
  t.equal(withoutParentApplicationName.getParentApplicationType(), undefined, 'an empty Pinpoint-pAppName leaves parentApplicationType unset')

  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-papptype', undefined)).getParentApplicationType(), -1, 'Pinpoint-pAppName without Pinpoint-pAppType is UNDEFINED -1')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-papptype', '')).getParentApplicationType(), -1, 'an empty Pinpoint-pAppType is UNDEFINED -1')
  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-papptype', 'abc')).getParentApplicationType(), -1, 'Pinpoint-pAppType abc is UNDEFINED -1')
  t.end()
})

test('Pinpoint-pServiceName is the parent service name', function (t) {
  const agent = nullDataSenderAgent()

  t.equal(readTraceHeader(agent, ParentTraceHeader.header('pinpoint-pservicename', 'parent.service')).getParentServiceName(), 'parent.service', 'parentServiceName is the Pinpoint-pServiceName')
  t.end()
})

function readTraceHeader(agent, headers) {
  const request = new HttpRequestTraceBuilder(agent.getTraceContext(), { url: '/', headers }).request
  return new TraceHeaderBuilder(request).build()
}
