'use strict'

const ValuedType = require('../constant/valued-type').ValuedType

class TypedValue {
  constructor (value, valuedType) {
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
      case 'object':
        if (valuedType === ValuedType.stringStringValue) {
          this.stringStringValue = value
        }
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
