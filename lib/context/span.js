/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const {convertTransactionId, convertAcceptEvent, convertIntStringValue, addAnnotations} = require('../data/grpc-data-convertor')
const spanMessages = require('../data/grpc/Span_pb')
const SpanEvents = require('./span-events')

class Span {
  constructor (traceId, agentInfo, requestData = {}) {
    if (!traceId || !agentInfo) {
      throw new Error('Can not initialize Span', traceId, agentInfo)
    }

    this.traceId = traceId
    this.agentId = agentInfo.agentId // required, from config
    this.applicationName = agentInfo.applicationName // required, from config
    this.agentStartTime = agentInfo.agentStartTime // required, from config
    this.serviceType = agentInfo.serviceType // required
    this.spanId = traceId.spanId // required
    this.parentSpanId = traceId.parentSpanId
    this.startTime = Date.now() // required
    this.elapsedTime = 0
    this.rpc = null // uri
    this.endPoint = null // host, domain
    this.remoteAddr = null // ip
    this.annotations = []
    this.flag = traceId.flag
    this.err = null
    this.spanEventList = []
    this.apiId = null
    this.exceptionInfo = null
    this.applicationServiceType = agentInfo.serviceType // from config
    this.loggingTransactionInfo = null // ?
    this.version = 1
    this.acceptorHost = requestData.host
    this.parentApplicationName = requestData.parentApplicationName
    this.parentApplicationType = requestData.parentApplicationType
  }

  markElapsedTime () {
    if (this.startTime) {
      this.elapsedTime = Date.now() - this.startTime
    }
  }

  get elapsed () {
    return this.elapsedTime
  }

  get spanMessage() {
    const pAcceptEvent = convertAcceptEvent(this)
    const pSpanMessage = new spanMessages.PSpanMessage()
    const pSpan = new spanMessages.PSpan()
    pSpan.setVersion(1)
  
    if (this.traceId) {
      const pTransactionId = convertTransactionId(this.traceId.transactionId)
      pSpan.setTransactionid(pTransactionId)
    }
  
    pSpan.setSpanid(this.spanId);
    pSpan.setParentspanid(this.parentSpanId);
    pSpan.setStarttime(this.startTime);
    pSpan.setElapsed(this.elapsedTime);
    pSpan.setApiid(this.apiId);
    pSpan.setServicetype(this.serviceType);
    pSpan.setAcceptevent(pAcceptEvent);
    pSpan.setFlag(this.flag);
    pSpan.setErr(this.err);
    pSpan.setExceptioninfo(convertIntStringValue(this.exceptionInfo));
    pSpan.setApplicationservicetype(this.applicationServiceType);
    pSpan.setLoggingtransactioninfo(this.loggingTransactionInfo);
  
    const spanEvents = new SpanEvents(this.spanEventList)
    const pSpanEvents = spanEvents.getpSpanEvents(this.startTime)
    if (pSpanEvents.length > 0) {
      pSpanEvents.forEach(pSpanEvent => pSpan.addSpanevent(pSpanEvent))
    }
    addAnnotations(pSpan, this.annotations)
  
    pSpanMessage.setSpan(pSpan)
    return pSpanMessage;
  }
}

module.exports = Span
