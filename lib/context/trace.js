'use strict'

const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')
const log = require('../utils/logger')

class Trace {
  constructor (traceId, agentInfo, sampling, requestData) {
    this.traceId = traceId

    this.span = new Span(traceId, agentInfo, requestData)
    this.spanRecorder = new SpanRecorder(this.span)

    this.spanEventRecorder = null

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
      log.error('SpanEvent does not exists in call-stack', spanEvent)
      return null
    }
    if (index === this.callStack.length - 1) {
      this.completeSpanEvent(this.callStack.pop())
    } else {
      const spanEvent = this.callStack.splice(index, 1)
      log.warn('Remove spanEvent from middle of call-stack', spanEvent)
      this.completeSpanEvent(spanEvent)
    }
  }

  completeSpanEvent (spanEvent) {
    if (spanEvent && spanEvent.isValid()) {
      spanEvent.markElapsedTime()
      this.spanRecorder.recordSpanEvent(spanEvent)
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
    this.spanRecorder.recordSpanEvent(spanEventRecorder.spanEvent)
    spanEventRecorder.spanEvent.markElapsedTime()
    spanEventRecorder.recordEnd()
  }


  traceAsyncBegin (asyncId) {
    const spanEvent = new SpanEvent(this.span, 0)
    spanEvent.asyncId = asyncId.asyncId
    spanEvent.asyncSequence = asyncId.nextAsyncSequence
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime
    spanEvent.depth = 1

    return new SpanEventRecorder(spanEvent, this.span)
  }

  traceAsyncEnd (spanEventRecorder) {
    if (!spanEventRecorder || !spanEventRecorder.spanEvent) return
    this.spanRecorder.recordSpanEvent(spanEventRecorder.spanEvent)
    spanEventRecorder.spanEvent.markElapsedTime()
  }

  canSampled () {
    return this.sampling
  }

  getStartTime () {
    return (this.span && this.span.startTime) || 0
  }
}

module.exports = Trace
