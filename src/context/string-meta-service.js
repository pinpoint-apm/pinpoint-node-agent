'use strict'

const TStringMetaData = require('../data/dto/Trace_types').TStringMetaData
const stringMetaCacheKeyGenerator = require('../context/sequence-generator').stringMetaCacheKeyGenerator
const SimpleCache = require('../utils/simple-cache')

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
      this.dataSender.sendMetaInfo(stringMetaInfo)
    } catch (e) {
      throw new Error()
    }
    return true
  }

  createStringMetaInfo (metaInfo){
    const info = {
      agentId: this.agentId,
      agentStartTime: this.agentStartTime,
      stringId: metaInfo.stringId,
      stringValue: metaInfo.stringValue,
    }
    return new TStringMetaData(info)
  }
}

module.exports = new StringMetaService()
