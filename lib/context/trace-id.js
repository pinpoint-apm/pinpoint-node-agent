/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceId {
  constructor (transactionId, spanId, parentSpanId, flag) {
    // transactionId + spanId + parentSpanId
    this.transactionId = transactionId
    this.spanId = spanId
    this.parentSpanId = parentSpanId || -1
    this.flag = flag || 0
  }

  transactionSequence() {
    return this.transactionId && this.transactionId.sequence
  }
}

module.exports = TraceId
