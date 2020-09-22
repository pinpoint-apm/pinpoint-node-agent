/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const express = require('express')

const { fixture } = require('../test-helper')
const agent = require('../support/agent-singleton-mock')

const TEST_ENV = {
  host: 'localhost',
  port: 5006,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test('outgoing request', (t) => {
  agent.bindHttp()

  t.plan(7)
  const PATH = '/outgoingrequest'
  const app = new express()

  app.get(PATH, async (req, res) => {
    const https = require('https')
    const options = {
      hostname: 'naver.com',
      port: 443,
      path: '/',
      method: 'GET'
    }

    const trace = agent.currentTraceObject()
    const request = https.request(options, res => {
      const headers = res.req._headers
      t.equal(trace.traceId.transactionId.toString(), headers['pinpoint-traceid'])
      t.equal(trace.traceId.spanId, headers['pinpoint-pspanid'])
      t.equal(agent.config.applicationName, headers['pinpoint-pappname'])
      t.equal(agent.config.serviceType, headers['pinpoint-papptype'])
      t.equal(trace.traceId.flag, headers["pinpoint-flags"])
      t.equal(trace.canSampled(), headers["pinpoint-sampled"])
      res.on('data', d => {
        process.stdout.write(d)
      })
    })
    request.on('error', error => {
      console.error(error)
    })
    request.end()

    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH))
    t.ok(result1.status, 200)

    server.close()
  })
})

test('incomming request agent sampled true', (t) => {
  incomingRequest(t)
})

//https://github.com/naver/pinpoint/blob/ab07664e2ed944e90aa9c44f7e39597f39264c2b/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/plugin/request/DefaultTraceHeaderReader.java#L78
function incomingRequest(t, sampled) {
  agent.bindHttp()

  t.plan(5)
  const PATH = '/incommingrequest'
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

  app.get(PATH, async (req, res) => {
    const trace = agent.currentTraceObject()
    const headers = config.headers

    t.equal(trace.traceId.transactionId.toString(), headers['pinpoint-traceid'])
    t.equal(trace.traceId.spanId, headers['pinpoint-spanid'])
    t.equal(trace.traceId.parentSpanId, headers['pinpoint-pspanid'])
    if (sampled == undefined) {
      t.equal(trace.sampling, true)
    } else {
      t.equal(trace.sampling, sampled)
    }
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async () => {
    const result1 = await axios.get(getServerUrl(PATH), config)
    t.ok(result1.status, 200)

    server.close()
  })
}

test('incomming request agent sampled false', (t) => {
  fixture.config.sampling = false
  incomingRequest(t, false)
  fixture.config.sampling = true
})
