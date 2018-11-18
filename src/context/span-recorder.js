const Annotation = require('./annotation')
const ServiceType = require('./service-type')
const DefaultAnnotationKey = require('constant/annotation-key').DefaultAnnotationKey

class SpanRecorder {
  constructor (span) {
    this.span = span
  }

  recordServiceType (code, ...properties) {
    if (this.span && code) {
      this.span.serviceType = new ServiceType(code, properties)
    }
  }

  recordApiId (apiId) {
    if (this.span && apiId) {
      this.span.apiId = apiId
    }
  }

  recordApi (methodName, apiId) {
    if (this.span && methodName) {
      if (!apiId || apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodName)
        this.recordApiId(0)
      } else {
        this.recordApiId(apiId)
      }
    }
  }

  recordAttribute (key, value) {
    if (this.span && key && value) {
      const annotation = new Annotation(key, value)
      this.span.annotations.push(annotation)
    }
  }

  recordRpc (rpc) {
    if (this.span && rpc) {
      (this.span.rpc = rpc)
    }
  }

  recordEndPoint (endPoint) {
    if (this.span && endPoint) {
      (this.span.endPoint = endPoint)
    }
  }

  recordRemoteAddr (remoteAddr) {
    if (this.span && remoteAddr) {
      (this.span.remoteAddr = remoteAddr)
    }
  }

  recordException (error) {
    if (this.span && error) {
      this.span.err = 1
      this.span.exceptionInfo = error
    }
  }

  recordSpanEvent (spanEvent) {
    if (this.span && spanEvent) {
      this.span.spanEventList.push(spanEvent)
    }
  }
}

module.exports = SpanRecorder
