/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AsyncId = require('./async-id')
const asyncIdGenerator = require('./sequence-generators').asyncIdGenerator

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
    let asyncId
    if (this.nextAsyncId === null) {
      asyncId = asyncIdGenerator.next
      this.nextAsyncId = asyncId
    } else {
      asyncId = this.nextAsyncId
    }
    return new AsyncId(asyncId)
  }

  recordApiId() {
  }

  recordApi() {
  }

  recordApiWithParameters() {
  }

  recordApiDesc() {
  }

  recordHTTPURL() {
  }

  recordApiArguments() {
  }

  recordAttribute() {
  }

  recordException() {
  }

  recordEnd() {
    this.ended = true
  }
}

module.exports = DisableSpanEventRecorder