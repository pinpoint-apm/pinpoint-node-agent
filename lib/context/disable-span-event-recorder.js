/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AsyncId = require('./async-id')
const asyncIdGenerator = require('./sequence-generator').asyncIdGenerator

class DisableSpanEventRecorder {
    constructor() {
      this.nextAsyncId = null
      this.ended = false
      this.error = null
    }
  
    recordStartTime(startTime) {
    }
  
    recordServiceType(code, ...properties) {
    }
  
    recordDestinationId(id) {
    }
  
    recordEndPoint(endPoint) {
    }
  
    recordNextSpanId(nextSpanId) {
      if (nextSpanId) {
        this.nextSpanId = nextSpanId
      }
    }
    
    recordNextAsyncId() {
      let asyncId
      if (this.nextAsyncId === null) {
        asyncId = asyncIdGenerator.next
        this.nextAsyncId = asyncId
      } else {
        asyncId = this.nextAsyncId
      }
      return new AsyncId(asyncId)
    }
  
    recordApiId(apiId) {
    }
  
    recordApi(methodDescriptor) {
    }
  
    recordApiDesc(desc) {
    }
  
    recordHTTPURL(url) {
    }
  
    recordApiArguments(key, desc, valueType) {
    }
  
    recordAttribute(key, value, valueType) {
    }
  
    recordException(error, isError) {
    }
  
    recordEnd() {
      this.ended = true
    }
  }
  
  module.exports = DisableSpanEventRecorder