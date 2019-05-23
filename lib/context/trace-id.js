'use strict'

const Int64 = require('node-int64')

class TraceId {
  constructor (transactionId, spanId, parentSpanId, flag) {
    // transactionId + spanId + parentSpanId
    this.transactionId = transactionId
    this.spanId = new Int64(spanId)
    this.parentSpanId = parentSpanId ? new Int64(parentSpanId) : -1
    this.flag = flag || 0
  }

  transactionSequence() {
    return this.transactionId && this.transactionId.sequence
  }
}

module.exports = TraceId
