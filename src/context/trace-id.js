
class TraceId {
  constructor (transactionId, spanId, parentSpanId) {
    // transactionId + spanId + parentSpanId
    this.transactionId = transactionId
    this.spanId = spanId
    this.parentSpanId = parentSpanId || -1
  }
}

module.exports = TraceId
