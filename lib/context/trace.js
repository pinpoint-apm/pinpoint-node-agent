'use strict'

const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')

class Trace {
  constructor (traceId, agentInfo, sampling, requestData) {
    if (!traceId || !agentInfo) {
      // TODO define custom error
      throw new Error()
    }
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
    const peekedItem = this.callStack[this.callStack.length - 1]
    if (peekedItem && spanEventRecorder) {
      if (peekedItem === spanEventRecorder.spanEvent) {
        const spanEvent = this.callStack.pop()
        this.spanRecorder.recordSpanEvent(spanEvent)
        spanEvent.markElapsedTime()
        return spanEvent
      } else {
        const index = this.callStack.indexOf(spanEventRecorder.spanEvent)
        if (index) {
          this.callStack.splice(index, Number.MAX_VALUE)
          throw new Error("Invalid call stacks are removed.")
        }
      }
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
