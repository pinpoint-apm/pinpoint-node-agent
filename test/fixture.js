/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const TransactionId = require('../lib/context/transaction-id')
const TraceId = require('../lib/context/trace-id')
const SpanId = require('../lib/context/span-id')
const testConfig = require('./pinpoint-config-test.json')
const { ConfigBuilder } = require('../lib/config-builder')
const config = new ConfigBuilder(testConfig).build()

const getTransactionId = () => {
  const agentId = config.agentId
  const agentStartTime = Date.now()
  return new TransactionId(agentId, agentStartTime.toString(), '99')
}

const getTraceId = (transactionId) => {
  const spanId = SpanId.newSpanId()
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
