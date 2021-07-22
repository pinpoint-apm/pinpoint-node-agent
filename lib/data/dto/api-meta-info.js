/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ApiMetaInfo {
  constructor(initData = {}) {
    this.apiId = initData.apiId
    this.apiInfo = initData.apiInfo
    this.type = initData.type
    this.lineNumber = initData.lineNumber
    this.location = initData.location
  }

  static create(methodDescriptor) {
    const one = new ApiMetaInfo({
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiDescriptor,
      type: methodDescriptor.type,
    })
    if (methodDescriptor.getLineNumber() && typeof methodDescriptor.getLineNumber() === 'number') {
      one.lineNumber = methodDescriptor.getLineNumber()
    }
    if (methodDescriptor.getLocation() && typeof methodDescriptor.getLocation() === 'string') {
      one.location = methodDescriptor.getLocation()
    }
    return one
  }
}

module.exports = ApiMetaInfo
