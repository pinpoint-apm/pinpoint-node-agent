'use strict'

const TypedValue = require('../data/typed-value')

class Annotation {
  constructor (key, value, valuedType) {
    this.key = key.name
    this.value = new TypedValue(value, valuedType)
  }
}

module.exports = Annotation
