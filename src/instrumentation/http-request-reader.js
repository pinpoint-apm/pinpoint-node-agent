'use strict'

const url = require('url')

const PinpointHeader = require('constant/http-header').PinpointHeader
const TraceId = require('context/trace-id')

class HttpRequestReader {
  constructor (request) {
    if (!request) {
      throw new Error
    }
    this.transactionId = request.headers[PinpointHeader.HTTP_TRACE_ID.toLowerCase()]
    this.spanId = request.headers[PinpointHeader.HTTP_SPAN_ID.toLowerCase()]
    this.parentSpanId = request.headers[PinpointHeader.HTTP_PARENT_SPAN_ID.toLowerCase()]
    this.flag = request.headers[PinpointHeader.HTTP_FLAGS.toLowerCase()]

    this.rpcName = url.parse(request.url).pathname
    this.endPoint = request.headers && request.headers.host
    this.remoteAddress = request.connection.remoteAddress
  }

  getTraceId () {
    if (this.transactionId && this.spanId) {
      return new TraceId(this.transactionId, this.spanId, this.parentSpanId, this.flag)
    }
    return null
  }
}

module.exports = HttpRequestReader
