/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

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
      this.dataSender.send(span)
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

  flush () {
    const spanEventList = this.clearBuffer()
    this.sendSpanChunk(spanEventList)
  }

  overflow (storage) {
    return storage.length >= this.bufferSize
  }

  sendSpanChunk (spanEventList) {
    if (this.dataSender && spanEventList) {
      const spanChunk = this.createSpanChunk(spanEventList)
      this.dataSender.send(spanChunk)
    }
  }
}

module.exports = BufferedStorage
