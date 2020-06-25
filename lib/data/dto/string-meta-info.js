'use strict'

class StringMetaInfo {
  constructor(initData = {}) {
    this.stringId = initData.stringId
    this.stringValue = initData.stringValue
  }

  static create(stringId, stringValue) {
    return new StringMetaInfo({
      stringId: stringId,
      stringValue: stringValue,
    })
  }
}

module.exports = StringMetaInfo
