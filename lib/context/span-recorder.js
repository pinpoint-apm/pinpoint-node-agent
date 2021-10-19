/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Annotation = require('./annotation')
const StringMetaService = require('./string-meta-service')
const DefaultAnnotationKey = require('../constant/annotation-key').DefaultAnnotationKey

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
    if (this.span && methodDescriptor) {
      if (methodDescriptor.apiId === 0) {
        this.recordAttribute(DefaultAnnotationKey.API, methodDescriptor.fullName)
        this.recordApiId(0)
      } else {
        this.recordApiId(methodDescriptor.apiId)
      }
    }
  }


  recordAttribute(key, value) {
    if (this.span && key && value) {
      this.span.annotations.push(new Annotation(key, value))
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
