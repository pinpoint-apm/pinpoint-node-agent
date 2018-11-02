const Span = require('./vo/span')

class SpanRecorder {
  constructor () {
    this.span = null
  }

  init () {
    this.span = new SpanEvent()
  }
}

module.exports = SpanRecorder
