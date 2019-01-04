const TransactionId = require('context/transaction-id')
const TraceId = require('context/trace-id')
const IdGenerator = require('context/id-generator')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const LOG_LEVEL = require('utils/logger').LOG_LEVEL

const config = {
  agentId: 'dev-agent-app',
  applicationName: 'dev.agent.app',
  serviceType: ServiceTypeCode.express,
  collectorIp: '***REMOVED***',
  collectorTcpPort: 9994,
  collectorStatPort: 9995,
  collectorSpanPort: 9996,

  enabledDataSending: false,
  logLevel: LOG_LEVEL.DEBUG
}

const getTransactionId = () => {
  const agentId = config.agentId
  const agentStartTime = Date.now()
  return new TransactionId(agentId, agentStartTime, 99)
}

const getTraceId = (transactionId) => {
  const spanId = IdGenerator.next
  return new TraceId(transactionId || getTransactionId(), spanId)
}

const getAgentInfo = () => ({
  agentId: config.agentId,
  applicationName: config.applicationName,
  serviceType : config.serviceType,
  agentStartTime: Date.now(),
})

module.exports = {
  config,
  getTransactionId,
  getTraceId,
  getAgentInfo,
}
