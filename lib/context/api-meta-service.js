/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const apiMetaCacheKeyGenerator = require('../context/sequence-generator').apiMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const GeneralMethodDescriptor = require('../constant/method-descriptor').GeneralMethodDescriptor
const ApiMetaInfo = require('../data/dto/api-meta-info')
const log = require('../utils/logger')

class StringMetaCache {
  constructor() {
    this.cache = new SimpleCache(1024)
    this.dataSender = null
  }

  init(dataSender) {
    this.dataSender = dataSender

    Object.keys(GeneralMethodDescriptor).forEach(name => {
      this.cacheApi(GeneralMethodDescriptor[name])
    })
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
    if (!builder) return

    const fullName = builder.getFullName()
    const cachedValue = this.cache.get(fullName)

    if (cachedValue === null) {
      builder.setApiId(apiMetaCacheKeyGenerator.next)
      const methodDescriptor = builder.build()
      this.cache.put(fullName, methodDescriptor.getApiId())
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