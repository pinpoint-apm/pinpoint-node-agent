const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

const config = {
  agentId: 'agent-for-dev',
  applicationName: 'development application',
  serviceType: null,
}

const getTraceId = () => {
  const agentId = config.agentId
  const agentStartTime = Date.now()
  const transactionId = new TransactionId(agentId, agentStartTime)
  const spanId = IdGenerator.next
  return new TraceId(transactionId, spanId)
}

module.exports = {
  config,
  getTraceId,
}