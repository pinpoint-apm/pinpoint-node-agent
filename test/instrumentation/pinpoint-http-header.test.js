/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const express = require('express')

const {
  fixture
} = require('../test-helper')
const agent = require('../support/agent-singleton-mock')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('outgoing request when canSample true', (t) => {
  outgoingRequest(t, true)
})

function outgoingRequest(t, sampling) {
  agent.bindHttp()

  const isSamplingFunction = agent.traceContext.isSampling
  if (sampling) {
    agent.traceContext.isSampling = () => { return true }
  } else {
    agent.traceContext.isSampling = () => { return false }
  }

  const PATH = '/request'
  const app = new express()

  let actualTrace
  app.get(PATH, async (req, res) => {
    const https = require('https')
    const options = {
      hostname: 'naver.com',
      port: 443,
      path: '/',
      method: 'GET'
    }

    actualTrace = agent.currentTraceObject()

    const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    const headers = req.headers
    if (sampling) {
      t.equal(actualTrace.traceId.transactionId.toString(), headers['pinpoint-traceid'])
      t.equal(actualTrace.traceId.spanId, headers['pinpoint-pspanid'])
      t.equal(agent.config.applicationName, headers['pinpoint-pappname'])
      t.equal(agent.config.serviceType, Number(headers['pinpoint-papptype']))
      t.equal(actualTrace.traceId.flag.toString(), headers['pinpoint-flags'])
    } else {
      // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
      t.equal('s0', headers['pinpoint-sampled'])
    }
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    server.close()

    agent.traceContext.isSampling = isSamplingFunction
    t.end()
  })
}

test('outgoing request when canSample false', (t) => {
  outgoingRequest(t, false)
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
      "host": "localhost:3000",
      "connection": "Keep-Alive",
      "accept-encoding": "gzip",
      "user-agent": "okhttp/4.8.1",
      "pinpoint-traceid": "express-spring-sampleid^1599831487121^4",
      "pinpoint-spanid": "-387300102333636357",
      "pinpoint-pspanid": "3116250228920588432",
      "pinpoint-flags": "0",
      "pinpoint-pappname": "express-spring-sample",
      "pinpoint-papptype": "1210",
      "pinpoint-host": "localhost:3000"
    },
    params: {},
  }

  const PATH = '/incommingrequest'
  let expectedTransactionId
  let expectedSpanId
  app.get(PATH, async (req, res) => {
    const trace = agent.currentTraceObject()
    const headers = config.headers

    expectedTransactionId = trace.traceId.transactionId.toString()
    expectedSpanId = trace.traceId.spanId
    t.equal(expectedTransactionId, headers['pinpoint-traceid'])
    t.equal(expectedSpanId, headers['pinpoint-spanid'])
    t.equal(trace.traceId.parentSpanId, headers['pinpoint-pspanid'])
    if (sampled == undefined) {
      t.equal(trace.sampling, true)
    } else {
      t.equal(trace.sampling, sampled)
    }

    const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    const actualHeaders = {
      "accept": "application/json, text/plain, */*",
      "user-agent": "axios/0.18.1",
      "host": "localhost:5006",
      "pinpoint-traceid": "express-spring-sampleid^1599831487121^4",
      "pinpoint-spanid": "8478505740685359",
      "pinpoint-pspanid": "-387300102333636357",
      "pinpoint-pappname": "node.test.app",
      "pinpoint-papptype": "1400",
      "pinpoint-flags": "0",
      "pinpoint-host": "localhost:5006",
      "connection": "close"
    }
    const headers = req.headers
    if (sampled) {
      t.equal(expectedTransactionId, headers['pinpoint-traceid'])
      t.equal(expectedSpanId, headers['pinpoint-pspanid'])
      t.equal(actualHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
      t.equal(actualHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
      t.equal(actualHeaders['pinpoint-host'], headers['pinpoint-host'])
      t.equal(actualHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
    } else {
      // ClientCallStartInterceptor.java requestTraceWriter.write(metadata);
      t.equal('s0', headers['pinpoint-sampled'])
    }
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH), config)
    t.ok(result1.status, 200)
    if (sampled) {
      t.equal(typeof agent.dataSender.mockSpan.spanId, "string")  
      t.equal(typeof agent.dataSender.mockSpan.parentSpanId, "string")
      t.equal(typeof agent.dataSender.mockSpan.traceId.transactionId.agentStartTime, "string")
      t.equal(typeof agent.dataSender.mockSpan.traceId.transactionId.sequence, "string")
    }
    server.close()
    t.end()
  })
}

test('incomming request agent sampled false', (t) => {
  const config = require('../pinpoint-config-test')
  config.sampling.enable = false
  agent.bindHttp(config)
  incomingRequest(t, false)
  config.sampling.enable = true
})

test('incomming request by User', (t) => {
  agent.bindHttp()

  const app = new express()
  const PATH = '/incommingrequest'
  let expectedTransactionId
  let expectedSpanId
  app.get(PATH, async (req, res) => {
    const trace = agent.currentTraceObject()

    expectedTransactionId = trace.traceId.transactionId.toString()
    expectedSpanId = trace.traceId.spanId
    t.equal(typeof expectedTransactionId, "string")
    t.equal(typeof expectedSpanId, "string")
    t.equal(trace.traceId.parentSpanId, "-1")
    t.equal(trace.sampling, true)
    t.equal(typeof trace.traceId.transactionId.agentStartTime, "string")
    t.equal(typeof trace.traceId.transactionId.sequence, "string")
    
    const result1 = await axios.get(getServerUrl(OUTGOING_PATH))
    t.equal(result1.data, 'ok get', 'result equals')
    res.send('ok get')
  })

  const OUTGOING_PATH = '/outgoingrequest'
  app.get(OUTGOING_PATH, async (req, res) => {
    const actualHeaders = {
      "accept": "application/json, text/plain, */*",
      "user-agent": "axios/0.18.1",
      "host": "localhost:5006",
      "pinpoint-traceid": "express-spring-sampleid^1599831487121^4",
      "pinpoint-spanid": "8478505740685359",
      "pinpoint-pspanid": "-387300102333636357",
      "pinpoint-pappname": "node.test.app",
      "pinpoint-papptype": "1400",
      "pinpoint-flags": "0",
      "pinpoint-host": "localhost:5006",
      "connection": "close"
    }
    const headers = req.headers
    t.equal(expectedTransactionId, headers['pinpoint-traceid'])
    t.equal(expectedSpanId, headers['pinpoint-pspanid'])
    t.equal(actualHeaders['pinpoint-pappname'], headers['pinpoint-pappname'])
    t.equal(actualHeaders['pinpoint-papptype'], headers['pinpoint-papptype'])
    t.equal(actualHeaders['pinpoint-host'], headers['pinpoint-host'])
    t.equal(actualHeaders['pinpoint-sampled'], headers['pinpoint-sampled'])
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)
    t.equal(typeof agent.dataSender.mockSpan.spanId, "string")  
    t.equal(typeof agent.dataSender.mockSpan.parentSpanId, "string")
    t.equal(typeof agent.dataSender.mockSpan.traceId.transactionId.agentStartTime, "string")
    t.equal(typeof agent.dataSender.mockSpan.traceId.transactionId.sequence, "string")
    server.close()
    t.end()
  })
})