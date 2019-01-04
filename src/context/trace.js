'use strict'

const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')

class Trace {
  constructor (traceId, agentInfo, requestData) {
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
    if (peekedItem && spanEventRecorder && peekedItem === spanEventRecorder.spanEvent) {
      const spanEvent = this.callStack.pop()
      this.spanRecorder.recordSpanEvent(spanEvent)
      spanEvent.markElapsedTime()
      return spanEvent
    } else {
      const index = this.callStack.indexOf(spanEvent)
      if (index) {
        this.callStack.splice(index, Number.MAX_VALUE)
        throw new Error("Invalid call stacks are removed.")
      }
    }
  }
}

module.exports = Trace
