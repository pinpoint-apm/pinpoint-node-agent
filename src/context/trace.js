const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')

class Trace {
  constructor (traceId) {
    if (!traceId) {
      // TODO define custom error
      throw new Error()
    }
    this.traceId = traceId

    const span = new Span(traceId)
    this.spanRecorder = new SpanRecorder(span)

    this.spanEventRecorder = null

    this.callStack = []
    this.sequence = 0
  }

  traceBlockBegin () {
    const spanEvent = new SpanEvent(this.sequence++)
    this.callStack.push(spanEvent)
    spanEvent.depth = this.callStack.length
    spanEvent.startTime = Date.now()

    this.spanEventRecorder = new SpanEventRecorder(spanEvent)
    return this.spanEventRecorder
  }

  traceBlockEnd () {
    const spanEvent = this.callStack.pop()
    this.spanRecorder.recordSpanEvent(spanEvent)
    spanEvent.markElapsedTime()
  }

  pushCallStack (spanEventRecorder) {
    this.callStack.push(spanEventRecorder)
    spanEventRecorder(this.sequence)

    this.sequence += 1
  }
}

module.exports = Trace
