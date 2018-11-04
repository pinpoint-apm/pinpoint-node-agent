const test = require('tap').test

const TransactionId = require('context/transaction-id')

test('Should create with sequence number', function (t) {
  t.plan(3)

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const transactionId2 = new TransactionId(agentId, agentStartTime)

  t.ok(transactionId)
  t.equal(0, transactionId.sequence)
  t.equal(1, transactionId2.sequence)
})
