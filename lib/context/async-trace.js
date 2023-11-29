/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder')
const SpanEvent = require('./span-event')
const SpanChunk = require('./span-chunk')
const BufferedStorage = require('./buffered-storage')
const Trace = require('./trace')

class AsyncTrace extends Trace {
  constructor(span, asyncId, traceId, agentInfo, dataSender, sampling) {
    super(traceId, agentInfo, dataSender, sampling)
    this.span = span
    this.asyncId = asyncId
    const createAsyncSpanChunk = SpanChunk.getAsyncFactoryMethod(traceId, agentInfo, asyncId)
    this.storage = new BufferedStorage(dataSender, createAsyncSpanChunk)
  }

  traceAsyncBegin() {
    const spanEvent = new SpanEvent(this.span, this.sequence)
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime
    spanEvent.depth = this.callStack.length + 1

    this.callStack.push(spanEvent)
    this.sequence++

    return new SpanEventRecorder(spanEvent, this.span)
  }

  traceAsyncEnd(spanEventRecorder) {
    if (!spanEventRecorder || !spanEventRecorder.spanEvent) return
    this.storage.storeSpanEvent(spanEventRecorder.spanEvent)
    spanEventRecorder.spanEvent.markElapsedTime()

    this.callStack = this.callStack.filter(spanEvent => spanEvent.sequence != spanEventRecorder.spanEvent.sequence)
  }

  canSampled() {
    return this.sampling
  }

  close() {
    if (this.rootAsyncSpanEventRecorder) {
      this.traceAsyncEnd(this.rootAsyncSpanEventRecorder)
    }
    this.storage.flush()
    this.callStack = []
  }
}

module.exports = AsyncTrace
