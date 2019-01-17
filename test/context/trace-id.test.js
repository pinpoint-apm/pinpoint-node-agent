const test = require('tape')
const { log, fixture, util } = require('../test-helper')

const TransactionId = require('../../src/context/transaction-id')
const TraceId = require('../../src/context/trace-id')
const IdGenerator = require('../../src/context/id-generator')

test('Should create', function (t) {
  t.plan(2)

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const spanId = IdGenerator.next
  const traceId = new TraceId(transactionId, spanId)

  t.ok(traceId)
  t.equal(traceId.parentSpanId, -1)
})
