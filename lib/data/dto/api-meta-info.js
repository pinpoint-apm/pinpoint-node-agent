'use strict'

class ApiMetaInfo {
  constructor(initData = {}) {
    this.agentId = initData.agentId
    this.agentStartTime = initData.agentStartTime
    this.apiId = initData.apiId
    this.apiInfo = initData.apiDescriptor
    this.type = initData.type
  }

  static create(agentInfo, methodDescriptor) {
    return new ApiMetaInfo({
      agentId: agentInfo.agentId,
      agentStartTime: agentInfo.agentStartTime,
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiDescriptor,
      type: methodDescriptor.type,
    })
  }
}

module.exports = ApiMetaInfo
