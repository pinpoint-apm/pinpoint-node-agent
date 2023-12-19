/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const TransactionId = require('../../lib/context/transaction-id')
const TraceId = require('../../lib/context/trace-id')
const IdGenerator = require('../../lib/context/id-generator')
const agent = require('../support/agent-singleton-mock')
const express = require('express')
const axios = require('axios')

test('Should create', function (t) {
  t.plan(2)

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime.toString())
  const spanId = IdGenerator.stringValueOfNext()
  const traceId = new TraceId(transactionId, spanId)

  t.ok(traceId)
  t.equal(traceId.parentSpanId, '-1')
})

test('self request and request outgoing request', function (t) {
  agent.bindHttp()

  const app = new express()
  app.get('/test', async (req, res) => {
    res.send('ok')
  })
  const server = app.listen(5007, async function () {
    t.end()
    server.close()
  })
})
