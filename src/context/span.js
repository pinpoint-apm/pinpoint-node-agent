'use strict'

const TransactionIdUtils = require('../utils/transaction-id-utils')

class Span {
  constructor (traceId, agentInfo, requestData = {}) {
    if (!traceId || !agentInfo) {
      // TODO app에 영향을 미치지 않으려면 예외처리는 어떻게 해야 할까??
    }

    this.agentId = agentInfo.agentId // required, from config
    this.applicationName = agentInfo.applicationName // required, from config
    this.agentStartTime = agentInfo.agentStartTime // required, from config
    this.serviceType = agentInfo.serviceType // required
    this.spanId = traceId.spanId // required
    this.parentSpanId = traceId.parentSpanId
    this.transactionId = TransactionIdUtils.formatBytes(traceId.transactionId)
    this.startTime = Date.now() // required
    this.elapsedTime = 0
    this.rpc = null // uri
    this.endPoint = null // host, domain
    this.remoteAddr = null // ip
    this.annotations = []
    this.flag = traceId.flag
    this.err = null
    this.spanEventList = []
    this.apiId = null
    this.exceptionInfo = null
    this.applicationServiceType = agentInfo.serviceType // from config
    this.loggingTransactionInfo = null // ?
    this.version = 1
    this.acceptorHost = requestData.host
    this.parentApplicationName = requestData.parentApplicationName
    this.parentApplicationType = requestData.parentApplicationType
  }

  markElapsedTime () {
    if (this.startTime) {
      this.elapsedTime = Date.now() - this.startTime
    }
  }

  get elapsed () {
    return this.elapsedTime
  }
}

module.exports = Span
