'use strict'
const contextManager = require('../context/context-manager')
class SpanEvent {
  constructor(span, sequence) {
    if (!span || sequence === undefined || sequence === null) {
      throw new Error('Can not initialize SpanEvent', span, sequence)
    }

    this.spanId = span.spanId // optional
    this.sequence = sequence // required
    this.startTime = 0 // required
    this.elapsedTime = 0 // optional
    this.startElapsed = 0 // required
    // this.rpc = null // optional, deprecated
    this.serviceType = null // required
    this.endPoint = span.endPoint // optional
    this.annotations = [] // optional
    this.depth = -1 // optional
    this.nextSpanId = -1 // optional
    this.destinationId = span.endPoint // optional
    this.apiId = null // optional
    this.exceptionInfo = null // optional
    this.asyncId = null // optional
    this.nextAsyncId = null // optional
    this.asyncSequence = null // optional
    this.dummyId = null // optional
    this.nextDummyId = null // optional
  }

  markElapsedTime() {
    if (this.startTime) {
      this.elapsedTime = Date.now() - this.startTime
    }
  }

  get endElapsed() {
    return this.elapsedTime
  }

  isValid() {
    return this.sequence > -1 && this.spanId > -1 && this.serviceType
  }

  static get builder() {
    class SpanEventBuilder {
      constructor(span, sequence) {
        this.span = span

        this.spanId = span.spanId // optional
        this.sequence = sequence // required
        this.startTime = 0 // required
        this.elapsedTime = 0 // optional
        this.startElapsed = 0 // required
        // this.rpc = null // optional, deprecated
        this.serviceType = null // required
        this.endPoint = span.endPoint // optional
        this.annotations = [] // optional
        this.depth = -1 // optional
        this.nextSpanId = -1 // optional
        this.destinationId = span.endPoint // optional
        this.apiId = null // optional
        this.exceptionInfo = null // optional
        this.asyncId = null // optional
        this.nextAsyncId = null // optional
        this.asyncSequence = null // optional
        this.dummyId = null // optional
        this.nextDummyId = null // optional
      }

      setDepth(depth) {
        this.depth = depth
        return this
      }

      setStackLength(stackLength) {
        this.stackLength = stackLength
        return this
      }

      setStartTime(startTime) {
        this.startTime = startTime
        return this
      }

      setStartElapsed(startElapsed) {
        this.startElapsed = startElapsed
        return this
      }

      build() {
        const spanEvent = new SpanEvent(this.span, this.sequence)
        spanEvent.spanId = this.spanId
        spanEvent.sequence = this.sequence
        spanEvent.startTime = this.startTime
        spanEvent.elapsedTime = this.elapsedTime
        spanEvent.startElapsed = this.startElapsed
        spanEvent.serviceType = this.serviceType
        spanEvent.endPoint = this.endPoint
        spanEvent.annotations = this.annotations
        spanEvent.nextSpanId = this.nextSpanId
        spanEvent.destinationId = this.destinationId
        spanEvent.apiId = this.apiId
        spanEvent.exceptionInfo = this.exceptionInfo
        spanEvent.asyncId = this.asyncId
        spanEvent.nextAsyncId = this.nextAsyncId
        spanEvent.asyncSequence = this.asyncSequence
        spanEvent.dummyId = this.dummyId
        spanEvent.nextDummyId = this.nextDummyId
        
        const executionAsyncId = contextManager.executionAsyncId()
        if (this.sequence == 0) {
          spanEvent.depth = 1
        } else if (this.span.executionAsyncId == executionAsyncId) {
          spanEvent.depth = 1
        } else {
          spanEvent.depth = 1
        }

        return spanEvent
      }
    }
    return SpanEventBuilder
  }
}

module.exports = SpanEvent