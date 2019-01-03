'use strict'

const TStringMetaData = require('data/dto/Trace_types').TStringMetaData
const cacheKeyGenerator = require('context/sequence-generator').cacheKeyGenerator

class StringMetaCache {
  constructor() {
    this.cache = new Map()
    this.dataSender = null
    this.agentId = null
    this.agentStartTime = null
  }

  init (agentId, agentStartTime, dataSender) {
    this.dataSender = dataSender
    this.agentId = agentId
    this.agentStartTime = agentStartTime
  }

  get (stringValue) {
    if (!stringValue) return 0

    if (!this.cache.has(stringValue)) {
      const metaInfo = {
        stringValue,
        stringId: cacheKeyGenerator.next,
      }
      this.cache.set(stringValue, metaInfo)
      this.sendStringMetaInfo(metaInfo)
    }
    return this.cache.get(stringValue)
  }

  sendStringMetaInfo (metaInfo) {
    try {
      const stringMetaInfo = this.createStringMetaInfo(metaInfo)
      this.dataSender.sendApiMetaInfo(stringMetaInfo)
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

module.exports = new StringMetaCache()
