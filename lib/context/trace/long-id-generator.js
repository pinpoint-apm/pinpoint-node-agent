/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// IdGenerator.java
class LongIdGenerator {
  constructor(initValue = 0, maxValue = Number.MAX_SAFE_INTEGER) {
    this.initValue = initValue
    this.maxValue = maxValue
    this.sequence = initValue
  }

  next(delta = 1) {
    return '' + this.numberOfNext(delta)
  }

  numberOfNext(delta = 1) {
    if (this.sequence > this.maxValue) {
      this.sequence = this.initValue
    }
    const returnValue = this.sequence
    this.sequence = this.sequence + delta
    return returnValue
  }

  // for test
  reset() {
    this.sequence = this.initValue
  }
}

module.exports = LongIdGenerator