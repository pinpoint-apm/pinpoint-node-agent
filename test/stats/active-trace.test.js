/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const axios = require('axios')
const agent = require('../support/agent-singleton-mock')
const express = require('express')
const http = require('http')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const activeRequestRepository = require('../../lib/metric/active-request-repository')

const TEST_ENV = {
  host: 'localhost',
  port: 5005,
}
const getServerUrl = (path) => `http://${TEST_ENV.host}:${TEST_ENV.port}${path}`

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
        const actualCached = activeRequestRepository.activeTraceCache.get(trace.getTraceRoot().getTransactionId())
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
        const cacheSize = activeRequestRepository.activeTraceCache.cache.size
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