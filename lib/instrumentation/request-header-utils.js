/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const url = require('url')
const log = require('../utils/logger')

const RequestData = require('./request-data')
const PinpointHeader = require('../constant/http-header').PinpointHeader
const TransactionId = require('../context/transaction-id')
const samplingFlag = require('../sampler/sampling-flag')

class RequestHeaderUtils {
  static read (request) {
    if (!request) {
      return null
    }

    let requestData = new RequestData()
    const parsedUrl = url.parse(request.url)
    requestData.rpcName = parsedUrl ? parsedUrl.pathname : ''
    requestData.endPoint = this.getHeader(request, 'host')
    const remoteAddress = this.getHeader(request, 'x-forwarded-for') || request.connection.remoteAddress
    if (remoteAddress) {
      requestData.remoteAddress = remoteAddress.replace('::ffff:', '')
    }
    if (remoteAddress === "::1") {
      requestData.remoteAddress = "127.0.0.1";
    }
    if (this.getHeader(request, PinpointHeader.HTTP_TRACE_ID)) {
      requestData = this.readPinpointHeader(request, requestData)
    }
    log.debug('>> Read DATA from http header \n', requestData)
    return requestData
  }

  static readPinpointHeader (request, requestData) {
    requestData.transactionId = TransactionId.toTransactionId(this.getHeader(request, PinpointHeader.HTTP_TRACE_ID))
    if (requestData.transactionId) {
      const spanId = this.getHeader(request, PinpointHeader.HTTP_SPAN_ID);
      if (spanId) {
        requestData.spanId = spanId
      }

      const parentSpanId = this.getHeader(request, PinpointHeader.HTTP_PARENT_SPAN_ID);
      if (parentSpanId) {
        requestData.parentSpanId = parentSpanId
      }
      
      requestData.parentApplicationName = this.getHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_NAME)
      requestData.parentApplicationType = Number(this.getHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_TYPE))
      requestData.flags = Number(this.getHeader(request, PinpointHeader.HTTP_FLAGS))
      requestData.host = this.getHeader(request, PinpointHeader.HTTP_HOST)
      requestData.sampled = samplingFlag.isSamplingFlag(this.getHeader(request, PinpointHeader.HTTP_SAMPLED))
      requestData.isRoot = false
    }
    return requestData
  }

  static getHeader (request, name) {
    if (request.getHeader) {
      return request.getHeader(name.toLowerCase())
    }
    return request.headers[name.toLowerCase()]
  }

  static writeHTTPSampled(request) {
    this.setHeader(request, PinpointHeader.HTTP_SAMPLED, samplingFlag.samplingRateFalse())
  }

  static write (request, agent, nextSpanId, host) {
    if (!agent) {
      return
    }

    const trace = agent.currentTraceObject()
    if (request && trace && trace.traceId) {
      this.setHeader(request, PinpointHeader.HTTP_TRACE_ID, trace.traceId.transactionId.toString())
      this.setHeader(request, PinpointHeader.HTTP_SPAN_ID, nextSpanId)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_SPAN_ID, trace.traceId.spanId)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_NAME, agent.config.applicationName)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_TYPE, agent.config.serviceType)
      this.setHeader(request, PinpointHeader.HTTP_FLAGS, trace.traceId.flag)
      this.setHeader(request, PinpointHeader.HTTP_HOST, host)
    }
    log.debug('>> Writer http header \n', request._headers)
    return request
  }

  static setHeader (request, name, value) {
    if (request.setHeader) {
      request.setHeader(name, value)
    } else {
      request.headers[name] = value
    }
  }
}

module.exports = RequestHeaderUtils
