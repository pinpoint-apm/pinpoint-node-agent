/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AnnotationKeyProperty = require('../constant/annotation').AnnotationKeyProperty

class AnnotationKey {
  constructor (code, name, ...properties) {
    this.code = code
    this.name = name
    this.viewInRecordSet = false
    this.errorApiMetadata = false

    this.setProperties(properties)
  }

  setProperties (properties = []) {
    properties.forEach(p => {
      switch (p) {
        case AnnotationKeyProperty.VIEW_IN_RECORD_SET:
          this.viewInRecordSet = true
          break
        case AnnotationKeyProperty.ERROR_API_METADATA:
          this.errorApiMetadata = true
          break
      }
    })
  }

  getCode() {
    return this.code
  }

  getName() {
    return this.name
  }

  toString() {
    return `AnnotationKey{code=${this.code}, name=${this.name}}`
  }
}

module.exports = AnnotationKey
