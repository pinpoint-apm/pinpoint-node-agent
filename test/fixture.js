const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

const config = {
  agentId: 'dev-agent-2',
  applicationName: 'dev agent2',
  serviceType: ServiceTypeCode.express,
  collectorIp: '***REMOVED***',
  collectorTcpPort: 9994,
  collectorStatPort: 9995,
  collectorSpanPort: 9996,
  enabledDataSending: false,
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

const getAgentInfo = () => ({
  agentId: config.agentId,
  applicationName: config.applicationName,
  agentStartTime: Date.now(),
})

module.exports = {
  config,
  getTransactionId,
  getTraceId,
  getAgentInfo,
}