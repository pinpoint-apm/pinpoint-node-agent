'use strict'

const apiMetaCacheKeyGenerator = require('../context/sequence-generator').apiMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const GeneralMethodDescriptor = require('../constant/method-descriptor').GeneralMethodDescriptor
const log = require('../utils/logger')

class StringMetaCache {
  constructor() {
    this.cache = new SimpleCache(1024)
    this.dataSender = null
    this.agentId = null
    this.agentStartTime = null
  }

  init (agentInfo, dataSender) {
    this.dataSender = dataSender
    this.agentId = agentInfo.agentId
    this.agentStartTime = agentInfo.agentStartTime

    Object.keys(GeneralMethodDescriptor).forEach(name => {
      this.cacheApi(GeneralMethodDescriptor[name])
    })
  }

  cacheApi (methodDescriptor) {
    if (!methodDescriptor) return

    const apiDescriptor = methodDescriptor.apiDescriptor
    const cachedValue = this.cache.get(apiDescriptor)

    if (cachedValue === null) {
      methodDescriptor.apiId = apiMetaCacheKeyGenerator.next
      this.cache.put(apiDescriptor, methodDescriptor.apiId)
      this.sendApiMetaInfo(methodDescriptor)
    }
    return methodDescriptor
  }

  sendApiMetaInfo (methodDescriptor) {
    try {
      const stringMetaInfo = this.createApiMetaInfo(methodDescriptor)
      this.dataSender.sendApiMetaInfo(stringMetaInfo)
    } catch (e) {
      log.error('Fail to send api meta info', stringMetaInfo, e)
    }
    return true
  }

  createApiMetaInfo (methodDescriptor) {
    return {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiDescriptor,
      type: methodDescriptor.type,
    }
  }
}

module.exports = new StringMetaCache()
