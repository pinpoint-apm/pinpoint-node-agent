/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SequenceGenerator {
  constructor(initValue = 0, maxValue = Number.MAX_SAFE_INTEGER) {
    this.initValue = initValue
    this.maxValue = maxValue
    this.sequence = initValue
  }

  get next() {
    if (this.sequence > this.maxValue) {
      this.sequence = this.initValue
    }
    return this.sequence++
  }

  stringValueOfNext() {
    return this.next.toString()
  }

  getAndIncrement() {
    if (this.sequence > this.maxValue) {
      this.sequence = this.initValue
    }
    return this.sequence++
  }

  // for test
  reset() {
    this.sequence = this.initValue
  }
}

module.exports = SequenceGenerator
