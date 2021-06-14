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

  cacheAPIMeta(methodDescriptorBuilder) {
    if (!methodDescriptorBuilder) return

    const cachedValue = this.cache.get(methodDescriptorBuilder.cacheKey)

    const methodDescriptor = methodDescriptorBuilder.build()
    if (cachedValue === null) {
      methodDescriptorBuilder.setApiId(apiMetaCacheKeyGenerator.next)
      this.cache.put(methodDescriptorBuilder.cacheKey, methodDescriptorBuilder.apiID)
      this.sendApiMetaInfo(methodDescriptor)
    }
    return methodDescriptor
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