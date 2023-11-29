/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class DisableSpanEventRecorder {
  constructor() {
    this.nextAsyncId = null
    this.ended = false
    this.error = null
  }

  recordStartTime() {
  }

  recordServiceType() {
  }

  recordDestinationId() {
  }

  recordEndPoint() {
  }

  recordNextSpanId() {
  }

  recordNextAsyncId() {
  }

  recordApiId() {
  }

  recordApi() {
  }

  recordApiWithParameters() {
  }

  recordApiDesc() {
  }

  recordApiArguments() {
  }

  recordAttribute() {
  }

  recordException() {
  }

  recordSqlInfo() {
  }

  recordEnd() {
    this.ended = true
  }

  getLocalAsyncId() {
  }
}

module.exports = DisableSpanEventRecorder