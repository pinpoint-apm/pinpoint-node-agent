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
