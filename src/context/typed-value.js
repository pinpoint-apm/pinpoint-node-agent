'use strict'

class TypedValue {
  constructor (value) {
    switch (typeof value) {
      case 'number':
        this.intValue = value
        break;
      case 'boolean':
        this.boolValue = value
        break;
      case 'string':
        this.stringValue = value
        break;
      case 'undefined':
        this.stringValue = value
        break;
    }
  }

  static of (value) {
    return new TypedValue(value)
  }
}

module.exports = TypedValue
