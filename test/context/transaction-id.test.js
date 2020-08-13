/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const transactionIdGenerator = require('../../lib/context/sequence-generator').transactionIdGenerator
const TransactionId = require('../../lib/context/transaction-id')

test('Should create with sequence number', function (t) {
  t.plan(3)

  transactionIdGenerator.reset()

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const transactionId2 = new TransactionId(agentId, agentStartTime)

  t.ok(transactionId)
  t.equal(transactionId.sequence, 0)
  t.equal(transactionId2.sequence, 1)
})
