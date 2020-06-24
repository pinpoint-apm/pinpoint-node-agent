'use strict'

const SpanEventRecorder = require('./span-event-recorder')
const SpanEvent = require('./span-event')
const SpanChunk = require('./span-chunk')
const BufferedStorage = require('./buffered-storage')
const {ServiceTypeCode} = require('../constant/service-type')
const {GeneralMethodDescriptor} = require('../constant/method-descriptor')

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

    const spanEventRecorder = this.traceAsyncBegin()
    spanEventRecorder.recordServiceType(ServiceTypeCode.async)
    spanEventRecorder.recordApiId(GeneralMethodDescriptor.AsyncInvocation.apiId)
    spanEventRecorder.spanEvent.endPoint = null
    spanEventRecorder.spanEvent.destinationId = null
    this.storage.storeSpanEvent(spanEventRecorder.spanEvent)
  }

  traceAsyncBegin () {
    const spanEvent = new SpanEvent(this.span, this.sequence)
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime
    spanEvent.depth = this.callStack.length + 1

    this.callStack.push(spanEvent)
    this.sequence++

    return new SpanEventRecorder(spanEvent, this.span)
  }

  traceAsyncEnd (spanEventRecorder) {
    if (!spanEventRecorder || !spanEventRecorder.spanEvent) return
    this.storage.storeSpanEvent(spanEventRecorder.spanEvent)
    this.storage.flush()
    spanEventRecorder.spanEvent.markElapsedTime()

    this.callStack = this.callStack.filter(spanEvent => spanEvent.sequence != spanEventRecorder.spanEvent.sequence)
  }

  canSampled () {
    return this.sampling
  }

  close () {
    this.storage.flush()
    this.callStack = []
  }
}

module.exports = AsyncTrace
