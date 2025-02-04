/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const { fixture, util } = require('../test-helper')
const activeTrace = require('../../lib/metric/active-trace')
const agent = require('../support/agent-singleton-mock')
const express = require('express')
const http = require('http')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

test(`Should record active trace in multiple call`, function (t) {
  agent.bindHttp()

  const PATH = '/active-trace'
  const LASTONE_PATH = '/active-trace/lastone'
  const SHUTDOWN = '/shutdown'
  const app = new express()

  app.get(PATH, async (req, res) => {
    await util.sleep(2000)
    res.send('ok get')
  })

  app.get(LASTONE_PATH, async (req, res) => {
    res.send('ok get')
  })

  const server = app.listen(TEST_ENV.port, async function () {
    Promise.all([
      axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false }) }),
      axios.get(getServerUrl(PATH), { httpAgent: new http.Agent({ keepAlive: false }) }),
      axios.get(getServerUrl(LASTONE_PATH), { httpAgent: new http.Agent({ keepAlive: false }) }),
    ]).then((result) => {
      t.equal(activeTrace.getAllTraces().length, 0)
      t.equal('' + agent.mockAgentStartTime, agent.agentInfo.startTimestamp, "startTimestamp equals")

      server.close()
      t.end()
    }).catch(() => {
      server.close()
      t.end()
    })
  })

  t.equal(agent.mockAgentId, fixture.config.agentId, "Agent ID equals")
  t.equal(agent.agentInfo, agent.pinpointClient.agentInfo, "AgentInfo equals")
})

test(`Active trace should be recorded with HTTP call`, function (t) {
  const collectorServer = new grpc.Server()
  collectorServer.addService(services.MetadataService, {
    requestApiMetaData: (call, callback) => {
      const result = new spanMessages.PResult()
      callback(null, result)
    }
  })
  collectorServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
    agent.bindHttpWithCallSite(port)

    const app = new express()
    app.get('/active-trace', async (req, res) => {
      agent.callbackTraceClose((trace) => {
        const actualCached = agent.getTraceContext().activeRequestRepository.activeTraceCache.get(trace.getTraceRoot().getTransactionId())
        t.equal(actualCached, trace.getTraceRoot(), 'active trace traceRoot is cached')
      })
      setTimeout(() => {
        res.send('ok get')
      }, 1000)
    })

    const server = app.listen(TEST_ENV.port, async () => {
      const result = await axios.get(getServerUrl('/active-trace'), { httpAgent: new http.Agent({ keepAlive: false }) })
      t.equal(result.status, 200, 'status code is 200')
      server.close(() => {
        const cacheSize = agent.getTraceContext().activeRequestRepository.activeTraceCache.cache.size
        t.equal(cacheSize, 0, 'active trace cache is empty')
        t.end()
      })
    })
  })
  t.teardown(() => {
    collectorServer.tryShutdown(() => {

    })
  })
})