'use strict'

const TApiMetaData = require('../data/dto/Trace_types').TApiMetaData
const apiMetaCacheKeyGenerator = require('../context/sequence-generator').apiMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const GeneralMethodDescriptor = require('../constant/method-descriptor').GeneralMethodDescriptor

class StringMetaCache {
  constructor() {
    this.cache = new SimpleCache(1024)
    this.dataSender = null
    this.agentId = null
    this.agentStartTime = null
  }

  init (agentId, agentStartTime, dataSender) {
    this.dataSender = dataSender
    this.agentId = agentId
    this.agentStartTime = agentStartTime

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
      this.dataSender.sendMetaInfo(stringMetaInfo)
    } catch (e) {
      throw new Error()
    }
    return true
  }

  createApiMetaInfo (methodDescriptor) {
    const info = {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      apiId: methodDescriptor.apiId,
      apiInfo: methodDescriptor.apiDescriptor,
      type: methodDescriptor.type,
    }
    return new TApiMetaData(info)
  }
}

module.exports = new StringMetaCache()
