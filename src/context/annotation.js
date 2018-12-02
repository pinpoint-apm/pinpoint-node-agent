const annotationConstant = require('constant/annotation')
const TypedValue = require('context/typed-value')

class Annotation {
  constructor (key, value) {
    this.key = key.name
    this.value = Annotation.getTypedValue(value)
  }

  static getTypedValue (value) {
    const tValue = new TypedValue()
    switch (typeof value) {
      case 'number':
        tValue.intValue = value
        break;
      case 'boolean':
        tValue.boolValue = value
        break;
      case 'string':
        tValue.stringValue = value
        break;
      case 'undefined':
        tValue.stringValue = value
        break;
    }
    return tValue
  }
}

module.exports = Annotation
