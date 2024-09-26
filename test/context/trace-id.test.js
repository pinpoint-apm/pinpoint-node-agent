/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const TransactionId = require('../../lib/context/transaction-id')
const TraceId = require('../../lib/context/trace-id')
const SpanId = require('../../lib/context/span-id')

test('Should create', function (t) {
  t.plan(2)

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime.toString())
  const spanId = SpanId.newSpanId()
  const traceId = new TraceId(transactionId, spanId)

  t.ok(traceId)
  t.equal(traceId.parentSpanId, '-1')
})