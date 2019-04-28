'use strict'

const TransactionIdUtils = require('../utils/transaction-id-utils')

class SpanChunk {
  constructor (traceId, agentInfo, asyncId, spanEventList) {
    if (!traceId || !agentInfo) {
      throw new Error('Can not initialize SpanChunk', traceId, agentInfo)
    }

    this.agentId = agentInfo.agentId // required, from config
    this.applicationName = agentInfo.applicationName // required, from config
    this.agentStartTime = agentInfo.agentStartTime // required, from config
    this.serviceType = agentInfo.serviceType // required
    this.spanId = traceId.spanId // required
    this.parentSpanId = traceId.parentSpanId
    this.transactionId = TransactionIdUtils.formatBytes(traceId.transactionId)
    this.spanEventList = spanEventList
    this.endPoint = null // host, domain
    this.applicationServiceType = agentInfo.serviceType // from config
    this.localAsyncId = asyncId
  }

  static getFactoryMethod (agentInfo, traceId) {
    return (spanEventList) => new SpanChunk(agentInfo, traceId, null, spanEventList)
  }

  static getAsyncFactoryMethod (agentInfo, traceId, asyncId) {
    return (spanEventList) => new SpanChunk(agentInfo, traceId, asyncId, spanEventList)
  }
}

module.exports = SpanChunk
