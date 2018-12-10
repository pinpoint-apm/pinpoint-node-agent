const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const SequenceGenerator = require('context/sequence-generator')
const TransactionId = require('context/transaction-id')

test('Should create with sequence number', function (t) {
  t.plan(3)

  SequenceGenerator.reset()

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const transactionId2 = new TransactionId(agentId, agentStartTime)

  t.ok(transactionId)
  t.equal(transactionId.sequence, 0)
  t.equal(transactionId2.sequence, 1)
})
