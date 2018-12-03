const PinpointHeader = require('constant/http-header').PinpointHeader
const IdGenerator = require('context/id-generator')

class HttpRequestWriter {
  constructor (agent) {
    if (!agent || !agent.currentTraceObject()) {
      throw new Error
    }
    this.applicationName = agent.applicationName
    this.serviceType = agent.serviceType
    this.traceId = agent.currentTraceObject().traceId
  }

  write (request) {
    if (request && this.traceId) {
      request.headers[PinpointHeader.HTTP_TRACE_ID] = this.traceId.transactionId.toString()
      request.headers[PinpointHeader.HTTP_SPAN_ID] = IdGenerator.next
      request.headers[PinpointHeader.HTTP_PARENT_SPAN_ID] = this.traceId.spanId
      request.headers[PinpointHeader.HTTP_PARENT_APPLICATION_NAME] = this.applicationName
      request.headers[PinpointHeader.HTTP_PARENT_APPLICATION_TYPE] = this.serviceType
      request.headers[PinpointHeader.HTTP_FLAGS] = this.traceId.flag
    }
    return request
  }
}

module.exports = HttpRequestWriter
