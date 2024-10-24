/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// SpanId.java in Java agent
class SpanId {
  static nullSpanId = -1
  
  constructor () {
    this.MAX_NUM = Number.MAX_SAFE_INTEGER
  }

  get next () {
    return Math.floor(Math.random() * this.MAX_NUM)
  }

  newSpanId() {
    return this.next.toString()
  }
}

module.exports = new SpanId()
