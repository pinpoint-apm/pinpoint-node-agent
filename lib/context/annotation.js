/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TypedValue = require('../data/typed-value')

class Annotation {
  constructor (key, value, valuedType) {
    this.key = key.name
    this.value = new TypedValue(value, valuedType)
  }
}

module.exports = Annotation
