'use strict'

const TransactionIdUtils = require('../utils/transaction-id-utils')

class SpanChunk {
  constructor (traceId, agentInfo, localAsyncId = null, spanEventList) {
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
    this.localAsyncId = localAsyncId
  }

  static getFactoryMethod (agentInfo, traceId) {
    return (spanEventList, asyncId) => new SpanChunk(agentInfo, traceId, spanEventList)
  }
}

module.exports = SpanChunk
