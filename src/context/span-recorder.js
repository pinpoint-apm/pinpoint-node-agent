const Span = require('./vo/span')

class SpanRecorder {
  constructor () {
    this.span = null
  }

  start (traceId) {
    if (traceId) {
      this.span = new Span(traceId)
    }
  }

  recordServiceType (serviceType) {
    serviceType && (this.span.serviceType = serviceType)
  }

  recordApiId (apiId) {
    if (apiId && apiId)
    apiId && (this.span.apiId = apiId)
  }

  recordRpc (rpc) {
    rpc && (this.span.rpc= rpc)
  }
}

module.exports = SpanRecorder
