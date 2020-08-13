/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TransactionIdUtils = require('../utils/transaction-id-utils')
const spanMessages = require('../data/grpc/Span_pb')
const {convertTransactionId, convertLocalAsyncId} = require('../data/grpc-data-convertor')
const SpanEvents = require('./span-events')

class SpanChunk {
  constructor (traceId, agentInfo, asyncId, spanEventList) {
    if (!traceId || !agentInfo) {
      throw new Error('Can not initialize SpanChunk', traceId, agentInfo)
    }

    this.agentId = agentInfo.agentId // required, from config
    this.applicationName = agentInfo.applicationName // required, from config
    this.agentStartTime = agentInfo.agentStartTime // required, from config
    this.serviceType = agentInfo.serviceType // required
    this.spanId = traceId.spanId // required
    this.parentSpanId = traceId.parentSpanId
    this.transactionId = TransactionIdUtils.formatBytes(traceId.transactionId)
    this.transactionIdObject = traceId.transactionId
    this.spanEventList = spanEventList
    this.endPoint = null // host, domain
    this.applicationServiceType = agentInfo.serviceType // from config
    this.localAsyncId = asyncId
  }

  static getFactoryMethod (agentInfo, traceId) {
    return (spanEventList) => new SpanChunk(agentInfo, traceId, null, spanEventList)
  }

  static getAsyncFactoryMethod (agentInfo, traceId, asyncId) {
    return (spanEventList) => new SpanChunk(agentInfo, traceId, asyncId, spanEventList)
  }

  get spanMessage() {
    const pSpanMessage = new spanMessages.PSpanMessage()
    const pSpanChunk = new spanMessages.PSpanChunk()
    pSpanChunk.setVersion(1);
  
    const pTransactionId = convertTransactionId(this.transactionIdObject)
    pSpanChunk.setTransactionid(pTransactionId);
  
    pSpanChunk.setSpanid(this.spanId)
    pSpanChunk.setEndpoint(this.endPoint)
    pSpanChunk.setApplicationservicetype(this.applicationServiceType)
    pSpanChunk.setLocalasyncid(convertLocalAsyncId(this.localAsyncId))

    const keyTime = this.keyTime
    pSpanChunk.setKeytime(keyTime)
    
    const spanEvents = new SpanEvents(this.spanEventList)
    const pSpanEvents = spanEvents.getpSpanEvents(keyTime)
    if (pSpanEvents.length > 0) {
      pSpanEvents.forEach(pSpanEvent => pSpanChunk.addSpanevent(pSpanEvent))
    }
    
    pSpanMessage.setSpanchunk(pSpanChunk)
    return pSpanMessage
  }

  get keyTime() {
    const minStartTimeSpanEvent = this.spanEventList.reduce((minStartTimeSpanEvent, currentSpanEvent) => minStartTimeSpanEvent.startTime < currentSpanEvent.startTime ? minStartTimeSpanEvent : currentSpanEvent)
    if (!minStartTimeSpanEvent) {
      return 0;
    }
    return minStartTimeSpanEvent.startTime
  }
}

module.exports = SpanChunk
