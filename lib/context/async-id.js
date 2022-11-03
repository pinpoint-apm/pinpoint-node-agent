/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SequenceGenerator = require('./sequence-generator')

class AsyncId {
  constructor(asyncId) {
    this.asyncId = asyncId
    this.sequenceGenerator = new SequenceGenerator()
  }

  get nextAsyncSequence() {
    return this.sequenceGenerator.next
  }

}

module.exports = AsyncId