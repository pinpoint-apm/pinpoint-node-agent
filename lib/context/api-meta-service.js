/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const apiMetaCacheKeyGenerator = require('../context/sequence-generators').apiMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const ApiMetaInfo = require('../data/dto/api-meta-info')
const log = require('../utils/logger')
const defaultPredefinedMethodDescriptorRegistry = require('../constant/default-predefined-method-descriptor-registry')

class StringMetaCache {
  constructor() {
    this.cache = new SimpleCache(1024)
    this.dataSender = null
  }

  init(dataSender) {
    this.dataSender = dataSender
    defaultPredefinedMethodDescriptorRegistry.registryMethodDescriptor(this)
  }

  cacheApi(methodDescriptor) {
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

  // https://github.com/pinpoint-apm/pinpoint/blob/91ccacfa7940ee2bd1ff231f2072087962294109/profiler/src/main/java/com/navercorp/pinpoint/profiler/metadata/DefaultApiMetaDataService.java#L38
  cacheApiWithBuilder(builder) {
    if (!builder || (typeof builder.isRuntimeDetection === 'function' && builder.isRuntimeDetection())) return

    const cacheId = builder.getCacheId()
    const cachedValue = this.cache.get(cacheId)
    if (cachedValue === null) {
      builder.setApiId(apiMetaCacheKeyGenerator.next)
      const methodDescriptor = builder.build()
      this.cache.put(cacheId, methodDescriptor)
      this.sendApiMetaInfo(methodDescriptor)
      return methodDescriptor
    }
    return cachedValue
  }

  sendApiMetaInfo(methodDescriptor) {
    const apiMetaInfo = ApiMetaInfo.create(methodDescriptor)
    try {
      this.dataSender.send(apiMetaInfo)
    } catch (e) {
      log.error('Fail to send api meta info', apiMetaInfo, e)
    }
    return true
  }
}

module.exports = new StringMetaCache()