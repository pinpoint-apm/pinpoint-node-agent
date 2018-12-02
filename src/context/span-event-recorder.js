const Annotation = require('./annotation')
const ServiceType = require('./service-type')
const DefaultAnnotationKey = require('constant/annotation-key').DefaultAnnotationKey

class SpanEventRecorder {
  constructor (spanEvent) {
    this.spanEvent = spanEvent
  }

  recordStartTime (startTime) {
    this.spanEvent.startTime = startTime
  }

  recordServiceType (code, ...properties) {
    if (this.spanEvent && code) {
      // this.spanEvent.serviceType = new ServiceType(code, properties)
      this.spanEvent.serviceType = code
    }
  }

  recordDestinationId (id) {
    if (this.spanEvent && id) {
      this.spanEvent.destinationId= id
    }
  }

  recordApiId (apiId) {
    if (this.spanEvent && apiId !== undefined) {
      this.spanEvent.apiId = apiId
    }
  }

  recordApi (methodName, apiId) {
    if (this.spanEvent && methodName) {
      if (!apiId || apiId === 0) {
        // this.recordAttribute(DefaultAnnotationKey.API, methodName)
        this.recordApiId(0)
      } else {
        this.recordApiId(apiId)
      }
    }
  }

  recordAttribute (key, value) {
    if (this.spanEvent && key && value) {
      const annotation = new Annotation(key, value)
      this.spanEvent.annotations.push(annotation)
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
