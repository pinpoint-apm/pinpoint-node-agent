'use strict'

const SpanEventRecorder = require('./span-event-recorder')
const SpanEvent = require('./span-event')
const SpanChunk = require('./span-chunk')
const BufferedStorage = require('./buffered-storage')
const log = require('../utils/logger')

class AsyncTrace {
  constructor (span, asyncId, traceId, agentInfo, dataSender, sampling) {
    this.span = span
    this.traceId = traceId
    this.agentInfo = agentInfo
    this.asyncId = asyncId

    this.spanEventRecorder = null

    const createAsyncSpanChunk = SpanChunk.getAsyncFactoryMethod(traceId, agentInfo, asyncId)
    this.storage = new BufferedStorage(dataSender, createAsyncSpanChunk)

    this.callStack = []
    this.sequence = 0
    this.sampling = sampling
  }

  traceAsyncBegin () {
    const spanEvent = new SpanEvent(this.span, 0)
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime
    spanEvent.depth = 1
    return new SpanEventRecorder(spanEvent, this.span)
  }

  traceAsyncEnd (spanEventRecorder) {
    if (!spanEventRecorder || !spanEventRecorder.spanEvent) return
    this.storage.storeSpanEvent(spanEventRecorder.spanEvent)
    this.storage.flush()
    spanEventRecorder.spanEvent.markElapsedTime()
  }

  canSampled () {
    return this.sampling
  }

  close () {
    this.storage.flush()
  }
}

module.exports = AsyncTrace
