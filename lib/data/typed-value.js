/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const ValuedType = require('../constant/valued-type').ValuedType
const annotationMessages = require('./v1/Annotation_pb')
const { convertStringStringValue } = require('./grpc-data-convertor')

class TypedValue {
  constructor(value, valuedType) {
    switch (typeof value) {
      case 'number':
        this.intValue = value
        break
      case 'boolean':
        this.boolValue = value
        break
      case 'string':
        this.stringValue = value
        break
      case 'object':
        if (valuedType === ValuedType.stringStringValue) {
          this.stringStringValue = value
        }
        break
      case 'undefined':
        this.stringValue = value
        break
    }
  }

  static of(value) {
    return new TypedValue(value)
  }

  annotationValue() {
    const pAnnotationValue = new annotationMessages.PAnnotationValue()

    if (this.hasOwnProperty('intValue')) {
      pAnnotationValue.setIntvalue(this.intValue)
    } else if (this.hasOwnProperty('boolValue')) {
      pAnnotationValue.setBoolvalue(this.boolValue)
    } else if (this.hasOwnProperty('stringValue')) {
      pAnnotationValue.setStringvalue(this.stringValue)
    } else if (this.hasOwnProperty('stringStringValue')) {
      pAnnotationValue.setStringstringvalue(convertStringStringValue(this.stringStringValue))
    }
    return pAnnotationValue
  }
}

module.exports = TypedValue