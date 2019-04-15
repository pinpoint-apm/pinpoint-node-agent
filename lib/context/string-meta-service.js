'use strict'

const stringMetaCacheKeyGenerator = require('../context/sequence-generator').stringMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')
const log = require('../utils/logger')

class StringMetaService {
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
  }

  get (stringValue) {
    if (!stringValue) return 0

    const cachedValue = this.cache.get(stringValue)
    if (cachedValue === null) {
      const metaInfo = {
        stringValue,
        stringId: stringMetaCacheKeyGenerator.next,
      }
      this.cache.put(stringValue, metaInfo)
      this.sendStringMetaInfo(metaInfo)
      return metaInfo
    }
    return cachedValue
  }

  sendStringMetaInfo (metaInfo) {
    try {
      const stringMetaInfo = this.createStringMetaInfo(metaInfo)
      this.dataSender.sendStringMetaInfo(stringMetaInfo)
    } catch (e) {
      log.error('Fail to send string meta info', stringMetaInfo, e)
    }
    return true
  }

  createStringMetaInfo (metaInfo){
    return {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      stringId: metaInfo.stringId,
      stringValue: metaInfo.stringValue,
    }
  }
}

module.exports = new StringMetaService()
