'use strict'

const log = require('../utils/logger')

const DEFAULT_BUFFER_SIZE = 10

class BufferedStorage {
  constructor(dataSender, createSpanChunk, bufferSize = DEFAULT_BUFFER_SIZE) {
    this.dataSender = dataSender
    this.createSpanChunk = createSpanChunk
    this.bufferSize = bufferSize

    this.storage = null
  }

  storeSpanEvent (spanEvent) {
    if (spanEvent) {
      const storage = this.getBuffer()
      storage.push(spanEvent)
      if (this.overflow(storage)) {
        const spanEventList = this.clearBuffer()
        this.sendSpanChunk(spanEventList)
      }
    }
  }

  storeSpan (span) {
    if (span) {
      span.spanEventList = this.clearBuffer()
      this.dataSender.sendSpan(span)
    }
  }

  getBuffer () {
    if (this.storage === null) {
      this.storage = []
    }
    return this.storage
  }

  clearBuffer () {
    const copy = this.storage
    this.storage = null
    return copy
  }

  overflow (storage) {
    return storage.length >= this.bufferSize
  }

  sendSpanChunk (spanEventList) {
    if (this.dataSender) {
      const spanChunk = this.createSpanChunk(spanEventList)
      this.dataSender.sendSpanChunk(spanChunk)
    }
  }
}

module.exports = BufferedStorage
