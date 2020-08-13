/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class IdGenerator {
  constructor () {
    this.MAX_NUM = Number.MAX_SAFE_INTEGER
  }

  get next () {
    return Math.floor(Math.random() * this.MAX_NUM)
  }
}

module.exports = new IdGenerator()
