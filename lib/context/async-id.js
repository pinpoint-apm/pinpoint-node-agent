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

  // DefaultAsyncIdGenerator.java: nextAsyncId()
  static make() {
    return new AsyncId(AsyncId.asyncIdGenerator.getAndIncrement(), 0)
  }

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

  // DefaultAsyncId.java: nextLocalAsyncId
  nextLocalAsyncId2() {
    return new AsyncId(this.asyncId, this.sequence + 1)
  }

  sequenceNextLocalAsyncId() {
    if (this === AsyncId.nonAsyncId) {
      return this.nextLocalAsyncId() 
    }

    return new AsyncId(this.asyncId, this.sequence + 1)
  }
}

module.exports = AsyncId