/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DisableSpanEventRecorder = require('../disable-span-event-recorder')

class DisableChildTrace {
  constructor(traceRoot, spanRecorder) {
    this.traceRoot = traceRoot
    this.spanRecorder = spanRecorder
    this.spanEventRecorder = new DisableSpanEventRecorder(traceRoot)
  }

  traceBlockBegin() {
    return this.spanEventRecorder
  }

  traceBlockEnd() {}

  getAsyncSpanEventRecorder() {
    return this.spanEventRecorder
  }

  getSpanRecorder() {
    return this.spanRecorder
  }

  getTraceRoot() {
    return this.traceRoot
  }

  canSampled() {
    return false
  }

  close() {
  }
}

module.exports = DisableChildTrace