/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodType = require('../constant/method-type').MethodType

// https://github.com/pinpoint-apm/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/DefaultMethodDescriptor.java
class MethodDescriptor {
  constructor(moduleName, objectPath, methodName, type, apiDescriptor, apiId, fullName, className, lineNumber, fileName, location) {
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
    this.className = className
    this.lineNumber = lineNumber
    this.fileName = fileName
    this.location = location
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
    return this.fullName
  }

  getApiId() {
    return this.apiId
  }

  getModuleName() {
    return this.moduleName
  }

  getFunctionName() {
    return this.objectPath
  }

  getMethodName() {
    return this.methodName
  }

  getApiDescriptor() {
    return this.apiDescriptor
  }

  getClassName() {
    return this.className
  }

  getLineNumber() {
    return this.lineNumber
  }

  getAPIInfo() {
    return `${this.typeFunction()}${this.locationWithFileName()}`
  }

  typeFunction() {
    const buffer = []
    if (this.moduleName && typeof this.moduleName === 'string') {
      buffer.push(this.moduleName)
    }
    if (this.className && typeof this.className === 'string') {
      buffer.push(this.className)
    }
    if (this.objectPath && typeof this.objectPath === 'string') {
      buffer.push(this.objectPath)
    }
    return buffer.join('.')
  }

  locationWithFileName() {
    if (!this.location || typeof this.location !== 'string') {
      return ''
    }
    return ` (${this.location}${this.fileName})`
  }
}

module.exports = MethodDescriptor
