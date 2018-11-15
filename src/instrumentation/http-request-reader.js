const url = require('url')

const PinpointHeader = require('constant/http-header').PinpointHeader
const TraceId = require('context/trace-id')

class HttpRequestReader {
  constructor (req) {
    if (!req) {
      throw new Error
    }
    this.transactionId = req.headers[PinpointHeader.HTTP_TRACE_ID.toLowerCase()]
    this.spanId = req.headers[PinpointHeader.HTTP_SPAN_ID.toLowerCase()]
    this.parentSpanId = req.headers[PinpointHeader.HTTP_PARENT_SPAN_ID.toLowerCase()]
    this.flag = req.headers[PinpointHeader.HTTP_FLAGS.toLowerCase()]

    this.rpcName = url.parse(req.url).pathname
    this.endPoint = req.headers && req.headers.host
    this.remoteAddress = req.connection.remoteAddress
  }

  getTraceId () {
    if (this.transactionId && this.spanId) {
      return new TraceId(this.transactionId, this.spanId, this.parentSpanId, this.flag)
    }
    return null
  }
}

module.exports = HttpRequestReader
