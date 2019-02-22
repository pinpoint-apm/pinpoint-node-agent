'use strict'

const TypedValue = require('./typed-value')

class Annotation {
  constructor (key, value, valuedType) {
    this.key = key.name
    this.value = new TypedValue(value, valuedType)
  }
}

module.exports = Annotation
