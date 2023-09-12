/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ApiMetaInfo {
  constructor(apiId, apiInfo, type) {
    this.apiId = apiId
    this.apiInfo = apiInfo
    this.type = type
  }

  static create(methodDescriptor) {
    const builder = new ApiMetaDataBuilder(methodDescriptor.getApiId(), methodDescriptor.getApiDescriptor(), methodDescriptor.getType())
    if (methodDescriptor.getLineNumber && typeof methodDescriptor.getLineNumber() === 'number') {
      builder.setLineNumber(methodDescriptor.getLineNumber())
    }
    if (methodDescriptor.getLocation && typeof methodDescriptor.getLocation() === 'string') {
      builder.setLocation(methodDescriptor.getLocation())
    }
    return builder.build()
  }
}

class ApiMetaDataBuilder {
  constructor(apiId, apiInfo, type) {
    this.apiId = apiId
    this.apiInfo = apiInfo
    this.type = type
  }

  setLineNumber(lineNumber) {
    this.lineNumber = lineNumber
    return this
  }

  setLocation(location) {
    this.location = location
    return this
  }

  build() {
    const apiMetaData = new ApiMetaInfo(this.apiId, this.apiInfo, this.type)
    apiMetaData.lineNumber = this.lineNumber
    apiMetaData.location = this.location
    return apiMetaData
  }
}

module.exports = ApiMetaInfo
