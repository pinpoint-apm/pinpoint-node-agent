const SpanEvent = require('./vo/span-event')

class SpanEventRecorder {
  constructor () {
    this.spanEvent = new SpanEvent()
  }

  recordStartTime (startTime) {
    this.spanEvent.startTime = startTime
  }

  recordServiceType (serviceType) {
    if (this.spanEvent && serviceType) {
      this.spanEvent.serviceType = serviceType
    }
  }

  recordApiId (apiId) {
    if (this.spanEvent && apiId) {
      this.spanEvent.apiId = apiId
    }
  }

  recordApi (methodDescriptor) {
    if (this.spanEvent && methodDescriptor) {
      if (methodDescriptor.apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodDescriptor.fullName)
      } else {
        this.recordApiId(methodDescriptor.apiId)
      }
    }
  }

  recordAttribute (key, value) {
    if (this.spanEvent && key && value) {
      const annotation = new Annotation(key, value)
      this.spanEvent.annotations.push(annotation)
    }
  }

  recordRpc (rpc) {
    if (this.spanEvent && rpc) {
      (this.spanEvent.rpc = rpc)
    }
  }

  recordException (error) {
    if (this.spanEvent && error) {
      this.spanEvent.err = 1
      this.spanEvent.exceptionInfo = error
    }
  }
}

module.exports = SpanEventRecorder
