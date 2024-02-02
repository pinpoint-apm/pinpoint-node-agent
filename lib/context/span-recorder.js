/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const StringMetaService = require('./string-meta-service')
const annotationKey = require('../constant/annotation-key')
const Annotations = require('../instrumentation/context/annotation/annotations')

class SpanRecorder {
  constructor(span) {
    this.span = span
  }

  recordServiceType(code) {
    if (this.span && code) {
      this.span.serviceType = code
    }
  }

  recordApiId(apiId) {
    if (this.span && apiId) {
      this.span.apiId = apiId
    }
  }

  recordApi(methodDescriptor) {
    if (!methodDescriptor || typeof methodDescriptor.getApiId !== 'function' || typeof methodDescriptor.getFullName !== 'function') {
      return
    }

    if (methodDescriptor.getApiId() === 0) {
      this.recordAttribute(annotationKey.API, methodDescriptor.getFullName())
    } else {
      this.setApiId0(methodDescriptor.getApiId())
    }
  }

  setApiId0(apiId) {
    this.span.setApiId(apiId)
  }

  recordAttribute(key, value) {
    if (this.span && key && typeof key.getCode === 'function' && value) {
      this.span.annotations.push(Annotations.of(key.getCode(), value))
    }
  }

  recordRpc(rpc) {
    if (this.span && rpc) {
      (this.span.rpc = rpc)
    }
  }

  recordEndPoint(endPoint) {
    if (this.span && endPoint) {
      this.span.endPoint = endPoint
    }
  }

  recordRemoteAddr(remoteAddr) {
    if (this.span && remoteAddr) {
      (this.span.remoteAddr = remoteAddr)
    }
  }

  recordException(error) {
    if (this.span && error) {
      const metaInfo = StringMetaService.get(error.name || 'Error')
      this.span.exceptionInfo = {
        intValue: metaInfo.stringId,
        stringValue: error.toString()
      }
      this.span.err = 1
    }
  }

  recordSpanEvent(spanEvent) {
    if (this.span && spanEvent) {
      this.span.spanEventList.push(spanEvent)
    }
  }
}

module.exports = SpanRecorder
