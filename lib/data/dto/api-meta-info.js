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
  }

  static create(methodDescriptor) {
    return new ApiMetaInfo({
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiDescriptor,
      type: methodDescriptor.type,
    })
  }
}

module.exports = ApiMetaInfo
