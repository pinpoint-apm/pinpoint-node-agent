const Span = require('./vo/span')
const Annotation = require('./annotation')
const DefaultAnnotationKey = require('constant/annotation-keyt ').DefaultAnnotationKey

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
    if (this.span && serviceType) {
      this.span.serviceType = serviceType
    }
  }

  recordApiId (apiId) {
    if (this.span && apiId) {
      this.span.apiId = apiId
    }
  }

  recordApi (methodDescriptor) {
    if (this.span && methodDescriptor) {
      if (methodDescriptor.apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodDescriptor.fullName)
      } else {
        this.recordApiId(methodDescriptor.apiId)
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
  recordException (error) {
    if (this.span && error) {
      this.span.err = 1
      this.span.exceptionInfo = error
    }
  }
}

module.exports = SpanRecorder
