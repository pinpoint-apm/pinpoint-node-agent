/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class RequestData {
  constructor () {
    this.transactionId = null
    this.spanId = null
    this.parentSpanId = null
    this.parentApplicationName = null
    this.parentApplicationType = null
    this.host = null
    this.sampled = null
    this.isRoot = true
    this.rpcName = null
    this.endPoint = null
    this.remoteAddress = null
  }
}

module.exports = RequestData
