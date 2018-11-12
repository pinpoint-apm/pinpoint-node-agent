
class SpanEvent {
  constructor (sequence) {
    if (!sequence) {
    }

    this.spanId = null // optional
    this.sequence = sequence || -1 // required
    this.startElapsed = 0 // required
    this.endElapsed = 0 // optional
    this.rpc = null // optional
    this.serviceType = null // required
    this.endPoint = null // optional
    this.annotations = null // optional
    this.depth = -1 // optional
    this.nextSpanId = -1 // optional
    this.destinationId = null // optional
    this.apiId = null // optional
    this.exceptionInfo = null // optional
    this.asyncId = null // optional
    this.nextAsyncId = null // optional
    this.asyncSequence = null // optional
  }
}

module.exports = SpanEvent
