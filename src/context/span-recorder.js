const Span = require('./span')

class SpanRecorder {
  constructor () {
    this.span= null
  }

  init () {
    this.span = new SpanEvent()
  }
}

module.exports = SpanRecorder
