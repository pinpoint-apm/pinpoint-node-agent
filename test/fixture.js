/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const TransactionId = require('../lib/context/transaction-id')
const TraceId = require('../lib/context/trace-id')
const IdGenerator = require('../lib/context/id-generator')
const shimmer = require('@pinpoint-apm/shimmer')
const testConfig= require('./pinpoint-config-test')
require('../lib/config').clear()
const config = require('../lib/config').getConfig(testConfig)
const { namedGroupLocationFileName, namedGroupTypeMethod } = require('../lib/instrumentation/call-stack')
const TraceBuilder = require('../lib/instrumentation/context/trace-builder')
const localStorage = require('../lib/instrumentation/context/local-storage')

const getTransactionId = () => {
  const agentId = config.agentId
  const agentStartTime = Date.now()
  return new TransactionId(agentId, agentStartTime.toString(), "99")
}

const getTraceId = (transactionId) => {
  const spanId = IdGenerator.stringValueOfNext()
  return new TraceId(transactionId || getTransactionId(), spanId)
}

const getAgentInfo = () => ({
  agentId: config.agentId,
  applicationName: config.applicationName,
  serviceType : config.serviceType,
  agentStartTime: Date.now(),
})

const captureNamedGroup = (callSite) => {
  return Object.assign({}, namedGroupLocationFileName([callSite], 0)
                          , namedGroupTypeMethod([callSite], 0))
}

let actualAsyncTraces = []
shimmer.wrap(TraceBuilder.prototype, 'buildAsyncTrace', function (original) {
  return function () {
      const asyncTrace = original.apply(this, arguments)
      actualAsyncTraces.push(asyncTrace)
      return asyncTrace
  }
})

function getAsyncTraceByAsyncId(asyncId) {
  return actualAsyncTraces.find((trace) => {
      return trace.asyncId.asyncId === asyncId
  })
}

function cleanup() {
  actualAsyncTraces = []
}

function assertSpanChunk(asyncTrace, callback) {
  const origin = asyncTrace.close
  asyncTrace.close = function () {
      origin.apply(this, arguments)
      callback(asyncTrace.storage.dataSender.findSpanChunk(asyncTrace.asyncId))
  }
}

function assertTrace(callback) {
  const trace = localStorage.getStore()
  const origin = trace.close
  trace.close = function () {
      origin.apply(this, arguments)
      callback(trace)
  }
}

module.exports = {
  config,
  getTransactionId,
  getTraceId,
  getAgentInfo,
  captureNamedGroup,
  getAsyncTraceByAsyncId,
  assertSpanChunk,
  assertTrace,
  cleanup
}
