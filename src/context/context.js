const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')

class Context {
  constructor (traceId) {
    this.traceId = traceId
    this.spanRecorder = new SpanRecorder().start(traceId)
    this.spanEventRecorder = new SpanEventRecorder()

    this.callStack = []
  }

  get currentSpanEventRecorder () {

  }
}

module.exports = Context
