const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')

const config = {
  agentId: 'agent-for-dev',
  applicationName: 'agent for dev',
  serviceType: null,
  collectorIp: '127.0.0.1',
  collectorTcpPort: 9994,
  collectorStatPort: 9995,
  collectorSpanPort: 9996,
}

const getTransactionId = () => {
  const agentId = config.agentId
  const agentStartTime = Date.now()
  return new TransactionId(agentId, agentStartTime, 99)
}

const getTraceId = (_transactionId) => {
  const transactionId = _transactionId || getTransactionId()
  const spanId = IdGenerator.next
  return new TraceId(transactionId, spanId)
}

module.exports = {
  config,
  getTransactionId,
  getTraceId,
}