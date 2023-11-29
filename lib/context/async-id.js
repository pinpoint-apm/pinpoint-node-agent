/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SequenceGenerator = require('./sequence-generator')

// ref: DefaultAsyncId.java
class AsyncId {
  static asyncIdGenerator = new SequenceGenerator(1)
  static nonAsyncId = new AsyncId(0, 0)

  constructor(asyncId, sequence) {
    this.asyncId = asyncId
    this.sequence = sequence
  }

  getAsyncId() {
    return this.asyncId
  }

  getSequence() {
    return this.sequence
  }

  nextLocalAsyncId() {
    const asyncId = AsyncId.asyncIdGenerator.next
    return new AsyncId(asyncId, this.sequence + 1)
  }
}

module.exports = AsyncId