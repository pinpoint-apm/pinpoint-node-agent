const test = require('tape')

const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

test('Should create', function (t) {
  t.plan(2)

  const agentId = 'agent-for-dev'
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const spanId = IdGenerator.next
  const traceId = new TraceId(transactionId, spanId)

  t.ok(traceId)
  t.equal(-1, traceId.parentSpanId)
})
