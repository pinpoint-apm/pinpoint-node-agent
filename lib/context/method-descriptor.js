/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodType = require('../constant/method-type').MethodType

// https://github.com/pinpoint-apm/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/recorder/AbstractRecorder.java
class MethodDescriptor {
  constructor(moduleName, objectPath, methodName, type, apiDescriptor, apiId, fullName, lineNumber) {
    this.moduleName = moduleName
    this.objectPath = objectPath
    this.methodName = methodName
    this.type = type || MethodType.DEFAULT
    this.apiDescriptor = apiDescriptor || this.getDescriptor()

    if (typeof apiId === 'number') {
      this.apiId = apiId
    } else {
      this.apiId = 0
    }

    this.fullName = fullName
    this.lineNumber = lineNumber
  }

  static create(moduleName, objectPath, methodName) {
    return new MethodDescriptor(moduleName, objectPath, methodName)
  }

  getDescriptor() {
    return [this.moduleName, this.objectPath, this.methodName]
      .filter(v => v)
      .join('.')
  }

  getFullName() {
    if (!this.fullName) {
      return this.apiDescriptor
    }
    return this.fullName
  }
}

module.exports = MethodDescriptor
