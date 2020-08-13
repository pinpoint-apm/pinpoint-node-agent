/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodType = require('../constant/method-type').MethodType

class MethodDescriptor {
  constructor (moduleName, objectPath, methodName, type, apiDescriptor) {
    this.moduleName = moduleName
    this.objectPath = objectPath
    this.methodName = methodName
    this.type = type || MethodType.DEFAULT
    this.apiDescriptor = apiDescriptor || this.getDescriptor()
    this.apiId = 0
  }

  static create (moduleName, objectPath, methodName) {
    return new MethodDescriptor(moduleName, objectPath, methodName)
  }

  getDescriptor() {
    return [this.moduleName, this.objectPath, this.methodName]
      .filter(v => v)
      .join('.')
  }
}

module.exports = MethodDescriptor
