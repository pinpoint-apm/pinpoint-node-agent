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
const https = require('https')
const localStorage = require('../../../lib/instrumentation/context/local-storage')
const Header = require('../../../lib/instrumentation/http/pinpoint-header')
const HttpClientRequest = require('../../../lib/instrumentation/http/http-client-request')
const OutgoingClientRequestHeaderWriter = require('../../../lib/instrumentation/http/outgoing-client-request-header-writer')

const endPoint = 'localhost:5005'
const rpcName = '/tests/123'

test('Should write pinpoint header', async function (t) {
  const agent = nullDataSenderAgent()
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('hello')
  })
    .on('request', (req) => {
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
        headerWriter.write(nextTraceId, agent.getConfig())
        t.equal(request.headers[Header.traceId], trace.spanBuilder.traceRoot.getTraceId().toStringDelimiterFormatted(), "trace ID new ID was added in Header")
        agent.completeTraceObject(trace)
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
