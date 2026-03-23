/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DisableSpanEventRecorder = require('../disable-span-event-recorder')
const DisableSpanRecorder = require('../disable-span-recorder')

class DisableChildTrace {
  constructor(traceRoot) {
    this.traceRoot = traceRoot
    this.spanRecorder = DisableSpanRecorder.nullObject
    this.spanEventRecorder = DisableSpanEventRecorder.nullObject
  }

  traceBlockBegin() {
    return this.spanEventRecorder
  }

  traceBlockEnd() {}

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