const Span = require('./vo/span')

class SpanRecorder {
  constructor () {
    this.span = null
  }

  start (traceId) {
    this.span = new Span(traceId)
  }
}

module.exports = SpanRecorder
