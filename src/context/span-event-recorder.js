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

  recordApi (methodDescriptor) {
    if (this.spanEvent && methodDescriptor) {
      console.log('>>> methodDescriptor', methodDescriptor)
      if (methodDescriptor.apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodDescriptor.fullName)
        this.recordApiId(0)
      } else {
        this.recordApiId(methodDescriptor.apiId)
      }
    }
  }

  recordAttribute (key, value) {
    if (this.spanEvent && key && value) {
      this.spanEvent.annotations.push(new Annotation(key, value))
      console.log('annotations >>', this.spanEvent.annotations)
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
