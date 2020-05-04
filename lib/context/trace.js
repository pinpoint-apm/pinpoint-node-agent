'use strict'

const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')
const AsyncTrace = require('./async-trace')
const BufferedStorage = require('./buffered-storage')
const SpanChunk = require('./span-chunk')
const log = require('../utils/logger')

class Trace {
  constructor (traceId, agentInfo, dataSender, sampling, requestData) {
    this.traceId = traceId
    this.agentInfo = agentInfo
    this.dataSender = dataSender

    this.span = new Span(traceId, agentInfo, requestData)
    this.spanRecorder = new SpanRecorder(this.span)

    this.spanEventRecorder = null


    const createSpanChunk = SpanChunk.getFactoryMethod(traceId, agentInfo)
    this.storage = new BufferedStorage(dataSender, createSpanChunk)

    this.callStack = []
    this.sequence = 0
    this.sampling = sampling
  }

  traceBlockDummy (serviceTypeCode) {
    const dummyRecorder = this.traceBlockBegin()
    dummyRecorder.recordServiceType(serviceTypeCode)
    this.traceBlockEnd(dummyRecorder)
    return dummyRecorder.recordDummyChaining()
  }

  traceBlockBegin () {
    const spanEvent = new SpanEvent(this.span, this.sequence)
    spanEvent.depth = this.callStack.length + 1
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime

    this.callStack.push(spanEvent)
    this.sequence++

    this.spanEventRecorder = new SpanEventRecorder(spanEvent, this.span)
    return this.spanEventRecorder
  }

  traceBlockEnd (spanEventRecorder) {
    if (!spanEventRecorder || this.callStack.length < 1) {
      return null
    }

    const index = this.callStack.findIndex(item => item === spanEventRecorder.spanEvent)
    if (index < 0) {
      log.error('SpanEvent does not exists in call-stack', spanEventRecorder.spanEvent)
      return null
    }

    spanEventRecorder.error &&  delete spanEventRecorder.error._pinpointCheck

    if (index === this.callStack.length - 1) {
      this.completeSpanEvent(this.callStack.pop())
    } else {
      const spanEvent = this.callStack.splice(index, 1)
      if (spanEvent && spanEvent.length > 0) {
        log.warn('Remove spanEvent from middle of call-stack', spanEvent[0])
        this.completeSpanEvent(spanEvent[0])
      }
    }
  }

  completeSpanEvent (spanEvent) {
    if (spanEvent && spanEvent.isValid()) {
      spanEvent.markElapsedTime()
      this.storage.storeSpanEvent(spanEvent)
      // this.spanRecorder.recordSpanEvent(spanEvent)
    }
  }

  newAsyncTrace (spanEventRecorder) {
    if (spanEventRecorder) {
      const asyncId = spanEventRecorder.recordNextAsyncId()
      return new AsyncTrace(this.span, asyncId, this.traceId, this.agentInfo, this.dataSender, this.sampling)
    }
  }

  newAsyncTraceWithId (asyncId) {
    if (asyncId) {
      return new AsyncTrace(this.span, asyncId, this.traceId, this.agentInfo, this.dataSender, this.sampling)
    }
  }

  traceCallbackBegin (dummyId) {
    const spanEvent = new SpanEvent(this.span, 0)
    spanEvent.dummyId = dummyId
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime

    this.spanEventRecorder = new SpanEventRecorder(spanEvent, this.span)
    return this.spanEventRecorder
  }

  traceCallbackEnd (spanEventRecorder) {
    if (!spanEventRecorder || !spanEventRecorder.spanEvent) return
    // this.spanRecorder.recordSpanEvent(spanEventRecorder.spanEvent)
    this.storage.storeSpanEvent(spanEventRecorder.spanEvent)
    spanEventRecorder.spanEvent.markElapsedTime()
    spanEventRecorder.recordEnd()
  }

  canSampled () {
    return this.sampling
  }

  getStartTime () {
    return (this.span && this.span.startTime) || 0
  }

  close () {
    this.storage.storeSpan(this.span)
  }
}

module.exports = Trace
