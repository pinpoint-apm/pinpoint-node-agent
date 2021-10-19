/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Annotation = require('./annotation')
const DefaultAnnotationKey = require('../constant/annotation-key').DefaultAnnotationKey
const StringMetaService = require('./string-meta-service')
const AsyncId = require('./async-id')
const asyncIdGenerator = require('./sequence-generator').asyncIdGenerator
const dummyIdGenerator = require('./sequence-generator').dummyIdGenerator
const AnnotationKeyUtils = require('./annotation-key-utils')

// https://github.com/pinpoint-apm/pinpoint/blob/master/bootstraps/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/context/SpanEventRecorder.java
class SpanEventRecorder {
  constructor(spanEvent, span) {
    this.spanEvent = spanEvent
    this.span = span
    this.ended = false
    this.error = null
  }

  recordStartTime(startTime) {
    this.spanEvent.startTime = startTime
  }

  recordServiceType(code) {
    if (this.spanEvent && code) {
      this.spanEvent.serviceType = code
    }
  }

  recordDestinationId(id) {
    if (this.spanEvent && id) {
      this.spanEvent.destinationId = id
    }
  }

  recordEndPoint(endPoint) {
    if (this.spanEvent && endPoint) {
      this.spanEvent.endPoint = endPoint
    }
  }

  recordNextSpanId(nextSpanId) {
    if (this.spanEvent && nextSpanId) {
      this.spanEvent.nextSpanId = nextSpanId
    }
  }

  recordDummyChaining() {
    this.spanEvent.nextDummyId = dummyIdGenerator.next
    return this.spanEvent.nextDummyId
  }

  recordNextAsyncId() {
    let asyncId
    if (this.spanEvent.nextAsyncId === null) {
      asyncId = asyncIdGenerator.next
      this.spanEvent.nextAsyncId = asyncId
    } else {
      asyncId = this.spanEvent.nextAsyncId
    }
    return new AsyncId(asyncId)
  }

  recordApiId(apiId) {
    if (this.spanEvent && apiId !== undefined) {
      this.spanEvent.apiId = apiId
    }
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/recorder/AbstractRecorder.java#L70
  recordApi(methodDescriptor) {
    if (this.spanEvent && methodDescriptor) {
      if (methodDescriptor.apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodDescriptor.fullName)
        this.recordApiId(0)
      } else {
        this.recordApiId(methodDescriptor.apiId)
      }
    }
  }

  recordApiWithParameters(methodDescriptor, parameters) {
    this.recordApi(methodDescriptor)
    this.recordArgs(parameters)
  }

  recordArgs(parameters) {
    const max = Math.min(parameters.length, DefaultAnnotationKey.MAX_ARGS_SIZE)
    for (let index = 0; index < max; index++) {
      this.recordAttribute(AnnotationKeyUtils.getArgs(index), parameters[index])
    }
  }

  recordApiDesc(desc) {
    if (this.spanEvent && desc) {
      this.recordAttribute(DefaultAnnotationKey.API, desc)
      this.recordApiId(0)
    }
  }

  recordHTTPURL(url) {
    if (this.spanEvent && url) {
      this.recordAttribute(DefaultAnnotationKey.HTTP_URL, url)
    }
  }

  recordApiArguments(key, desc, valueType) {
    if (this.spanEvent && desc) {
      this.recordAttribute(key, desc, valueType)
      this.recordApiId(0)
    }
  }

  recordAttribute(key, value, valueType) {
    if (this.spanEvent && key && value) {
      this.spanEvent.annotations.push(new Annotation(key, value, valueType))
    }
  }

  recordException(error, isError) {
    if (this.spanEvent && error) {
      const metaInfo = StringMetaService.get(error.name || 'Error')
      this.spanEvent.exceptionInfo = {
        intValue: metaInfo.stringId,
        stringValue: error.toString(),
      }
      if (this.span && isError) {
        this.span.err = 1
        this.error = error
      }
    }
  }

  recordEnd() {
    this.ended = true
  }
}

module.exports = SpanEventRecorder