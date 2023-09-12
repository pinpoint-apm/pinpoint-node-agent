/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const stringMetaCacheKeyGenerator = require('../context/sequence-generators').stringMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const StringMetaInfo = require('../data/dto/string-meta-info')
const log = require('../utils/logger')

class StringMetaService {
  constructor() {
    this.cache = new SimpleCache(1024)
    this.dataSender = null
  }

  init (dataSender) {
    this.dataSender = dataSender
  }

  get (stringValue) {
    if (!stringValue) return 0

    const cachedValue = this.cache.get(stringValue)
    if (cachedValue === null) {
      const id = stringMetaCacheKeyGenerator.next
      const stringMetaInfo = StringMetaInfo.create(id, stringValue)
      this.cache.put(stringValue, stringMetaInfo)
      this.sendStringMetaInfo(stringMetaInfo)
      return stringMetaInfo
    }
    return cachedValue
  }

  sendStringMetaInfo (stringMetaInfo) {
    try {
      this.dataSender.send(stringMetaInfo)
    } catch (e) {
      log.error('Fail to send string meta info', stringMetaInfo, e)
    }
    return true
  }
}

module.exports = new StringMetaService()
