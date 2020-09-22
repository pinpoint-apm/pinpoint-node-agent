/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
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
    return this.sequence > -1 && this.spanId && this.serviceType
  }
}

module.exports = SpanEvent