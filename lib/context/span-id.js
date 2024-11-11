/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// SpanId.java in Java agent
class SpanId {
  constructor() {
    this.MAX_NUM = Number.MAX_SAFE_INTEGER
  }

  nullSpanId() {
    return '-1'
  }

  get next() {
    return Math.floor(Math.random() * this.MAX_NUM)
  }

  newSpanId() {
    return this.next.toString()
  }

  nextSpanId(spanId, parentSpanId) {
    let newId = this.newSpanId()
    while (newId === spanId || newId === parentSpanId) {
      newId = this.newSpanId()
    }
    return newId
  }
}

module.exports = new SpanId()
