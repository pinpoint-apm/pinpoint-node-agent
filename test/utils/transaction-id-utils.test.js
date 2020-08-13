/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const transactionIdUtils = require('../../lib/utils/transaction-id-utils')

test('Should create buffer from transaction id', function (t) {
  t.plan(1)

  const result = transactionIdUtils.formatBytes(fixture.getTransactionId())
  log.debug(result)

  const agentId = fixture.getTransactionId().agentId
  const len = Buffer.from(agentId).length
  t.equal(result.toString('utf8', 2, 2 + len), agentId)
})

