/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const axios = require('axios')
const express = require('express')
const http = require('http')
const https = require('https')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('outgoing request when canSample false', (t) => {
  agent.bindHttp({ 'sampling': { 'enable': false } })
  const PATH = '/request'
  const app = new express()

  app.get(PATH, async (req, res) => {
    const result1 = await axios.get(getServerUrl(OUTGOING_PATH), {
      timeout: 1000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
    t.equal('s0', req.headers['pinpoint-sampled'], `sampled Header equals ${req.headers['pinpoint-sampled']}`)
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH), {
      timeout: 1000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.status, 200)

    server.close()
    t.end()
  })
})

test('incomming request agent sampled true', (t) => {
  agent.bindHttp()
  incomingRequest(t, true)
})

//https://github.com/naver/pinpoint/blob/ab07664e2ed944e90aa9c44f7e39597f39264c2b/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/DefaultTraceHeaderReader.java#L78
function incomingRequest(t, sampled) {
  const app = new express()

  let config = {
    headers: {
      'host': 'localhost:3000',
      'connection': 'Keep-Alive',
      'accept-encoding': 'gzip',
      'user-agent': 'okhttp/4.8.1',
      'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
      'pinpoint-spanid': '-387300102333636357',
      'pinpoint-pspanid': '3116250228920588432',
      'pinpoint-flags': '0',
      'pinpoint-pappname': 'express-spring-sample',
      'pinpoint-papptype': '1210',
      'pinpoint-host': 'localhost:3000'
    },
    params: {},
    timeout: 1000,
    httpAgent: new http.Agent({ keepAlive: false }),
    httpsAgent: new https.Agent({ keepAlive: false }),
  }

  const PATH = '/incommingrequest'
  let expectedTransactionId
  let expectedSpanId
  app.get(PATH, async (req, res) => {
    const trace = agent.currentTraceObject()
    const headers = config.headers

    expectedTransactionId = trace.getTraceRoot().getTraceId().toStringDelimiterFormatted()
    expectedSpanId = trace.getTraceRoot().getTraceId().getSpanId()
    t.equal(expectedTransactionId, headers['pinpoint-traceid'], `traceId Header equals ${expectedTransactionId}`)
    t.equal(expectedSpanId, headers['pinpoint-spanid'], `spanId Header equals ${expectedSpanId}`)
    t.equal(trace.getTraceRoot().getTraceId().getParentSpanId(), headers['pinpoint-pspanid'], `parentSpanId Header equals ${trace.getTraceRoot().getTraceId().getParentSpanId()}`)
    t.equal(trace.canSampled(), sampled, `sampled equals ${trace.canSampled()}`)

    const result1 = await axios.get(getServerUrl(OUTGOING_PATH), {
      timeout: 1000,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
    })
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    const expectedHeaders = {
      'accept': 'application/json, text/plain, */*',
      'user-agent': 'axios/0.18.1',
      'host': 'localhost:5006',
      'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
      'pinpoint-spanid': '8478505740685359',
      'pinpoint-pspanid': '-387300102333636357',
      'pinpoint-pappname': agent.getConfig().getApplicationName(),
      'pinpoint-papptype': '1400',
      'pinpoint-flags': '0',
      'pinpoint-host': 'localhost:5006',
      'connection': 'close'
    }
    const headers = req.headers
    if (sampled) {
      t.equal(expectedTransactionId, headers['pinpoint-traceid'])
      t.equal(expectedSpanId, headers['pinpoint-pspanid'])
      t.equal(expectedHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
      t.equal(expectedHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
      t.equal(expectedHeaders['pinpoint-host'], headers['pinpoint-host'])
      t.equal(expectedHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
    } else {
      // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
      t.equal('s0', headers['pinpoint-sampled'])
    }
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH), config)
    t.equal(result1.status, 200)
    if (sampled) {
      t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getSpanId(), 'string')
      t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getParentSpanId(), 'string')
      t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getAgentStartTime(), 'string')
      t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getTransactionId(), 'string')
    }
    server.close()
    t.end()
  })
}

test('incomming request by User', (t) => {
  agent.bindHttp()

  const app = new express()
  const PATH = '/incommingrequest'
  let expectedTransactionId
  let expectedSpanId
  let expectedFlags
  app.get(PATH, async (req, res) => {
    const trace = agent.currentTraceObject()

    expectedTransactionId = trace.getTraceId().toStringDelimiterFormatted()
    expectedSpanId = trace.getTraceId().spanId
    expectedFlags = trace.getTraceId().getFlags()
    t.equal(typeof expectedTransactionId, 'string')
    t.equal(typeof expectedSpanId, 'string')
    t.equal(trace.getTraceId().parentSpanId, '-1')
    t.equal(trace.canSampled(), true)
    t.equal(typeof trace.getTraceId().agentStartTime, 'string')
    t.equal(typeof trace.getTraceId().getTransactionId(), 'string')

    const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    const actualHeaders = {
      'accept': 'application/json, text/plain, */*',
      'user-agent': 'axios/0.18.1',
      'host': 'localhost:5006',
      'pinpoint-traceid': 'express-spring-sampleid^1599831487121^4',
      'pinpoint-spanid': '8478505740685359',
      'pinpoint-pspanid': '-387300102333636357',
      'pinpoint-pappname': agent.getConfig().getApplicationName(),
      'pinpoint-papptype': '1400',
      'pinpoint-flags': '0',
      'pinpoint-host': 'localhost:5006',
      'connection': 'close'
    }
    const headers = req.headers
    t.equal(expectedTransactionId, headers['pinpoint-traceid'])
    t.equal(expectedSpanId, headers['pinpoint-pspanid'])
    t.equal(actualHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
    t.equal(actualHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
    t.equal(actualHeaders['pinpoint-host'], headers['pinpoint-host'])
    t.equal(actualHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
    t.equal(expectedFlags, headers['pinpoint-flags'], `flags Header equals ${expectedFlags}`)
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH))
    t.equal(result1.status, 200)
    t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getSpanId(), 'string')
    t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getParentSpanId(), 'string')
    t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().agentStartTime, 'string')
    t.equal(typeof agent.dataSender.mockSpan.traceRoot.getTraceId().getTransactionId(), 'string')
    server.close()
    t.end()
  })
})