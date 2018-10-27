const SpanEvent = require('./span-event')

class SpanEventRecorder {
  constructor () {
    this.spanEvent = new SpanEvent()
    this.sequence = -1
  }

  recordStartTime (startTime) {
    this.spanEvent.startTime = startTime
  }
}

module.exports = SpanEventRecorder
