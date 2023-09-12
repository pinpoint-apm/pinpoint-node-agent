/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SequenceGenerator = require('./sequence-generator')

class AsyncId {
  constructor(asyncId, sequence) {
    this.asyncId = asyncId
    if (typeof sequence === 'number') {
      this.sequence = sequence
    } else {
      this.sequence = 0
    }
    this.sequenceGenerator = new SequenceGenerator()
  }

  getAsyncId() {
    return this.asyncId
  }

  getSequence() {
    return this.sequence
  }

  get nextAsyncSequence() {
    return this.sequenceGenerator.next
  }

  nextLocalAsyncId() {
    const asyncId = this.getAsyncId()
    const sequence = this.nextAsyncSequence()
    return new AsyncId(asyncId, sequence)
  }
}

module.exports = AsyncId