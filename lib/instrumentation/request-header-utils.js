'use strict'

const url = require('url')
const Int64 = require('node-int64')
const Int64BE = require("int64-buffer").Int64BE;
const log = require('../utils/logger')

const RequestData = require('./request-data')
const PinpointHeader = require('../constant/http-header').PinpointHeader
const TransactionId = require('../context/transaction-id')

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
    if (this.getHeader(request, PinpointHeader.HTTP_TRACE_ID)) {
      requestData = this.readPinpointHeader(request, requestData)
    }
    log.debug('>> Read DATA from http header \n', requestData)
    return requestData
  }

  static readPinpointHeader (request, requestData) {
    requestData.transactionId = TransactionId.toTransactionId(this.getHeader(request, PinpointHeader.HTTP_TRACE_ID))
    if (requestData.transactionId) {
      requestData.spanId = new Int64(Int64BE(this.getHeader(request, PinpointHeader.HTTP_SPAN_ID)).toBuffer())
      requestData.parentSpanId = new Int64(Int64BE(this.getHeader(request, PinpointHeader.HTTP_PARENT_SPAN_ID)).toBuffer())
      requestData.parentApplicationName = this.getHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_NAME)
      requestData.parentApplicationType = Number(this.getHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_TYPE))
      requestData.flags = Number(this.getHeader(request, PinpointHeader.HTTP_FLAGS))
      requestData.host = this.getHeader(request, PinpointHeader.HTTP_HOST)
      requestData.sampled = this.getHeader(request, PinpointHeader.HTTP_SAMPLED) === 'true'
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

  static write (request, agent, nextSpanId, host) {
    if (!agent) {
      return
    }

    const trace = agent.currentTraceObject()
    if (request && trace && trace.traceId) {
      this.setHeader(request, PinpointHeader.HTTP_TRACE_ID, trace.traceId.transactionId.toString())
      this.setHeader(request, PinpointHeader.HTTP_SPAN_ID, nextSpanId)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_SPAN_ID, trace.traceId.spanId)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_NAME, agent.agentInfo.applicationName)
      this.setHeader(request, PinpointHeader.HTTP_PARENT_APPLICATION_TYPE, agent.agentInfo.serviceType)
      this.setHeader(request, PinpointHeader.HTTP_FLAGS, trace.traceId.flag)
      this.setHeader(request, PinpointHeader.HTTP_HOST, host)
      this.setHeader(request, PinpointHeader.HTTP_SAMPLED, trace.canSampled())
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
