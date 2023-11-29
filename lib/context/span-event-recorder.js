/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../constant/annotation-key')
const StringMetaService = require('./string-meta-service')
const AsyncId = require('./async-id')
const AnnotationKeyUtils = require('./annotation-key-utils')
const log = require('../utils/logger')
const sqlMetaDataService = require('../instrumentation/sql/sql-metadata-service')
const Annotations = require('../instrumentation/context/annotation/annotations')
const IntStringStringValue = require('../instrumentation/context/annotation/int-string-string-value')

// https://github.com/pinpoint-apm/pinpoint/blob/master/bootstraps/bootstrap-core/src/main/java/com/navercorp/pinpoint/bootstrap/context/SpanEventRecorder.java
class SpanEventRecorder {
  constructor(spanEvent, span) {
    this.spanEvent = spanEvent
    this.span = span
    this.ended = false
    this.error = null
    this.asyncId = AsyncId.nonAsyncId
  }

  recordStartTime(startTime) {
    this.spanEvent.startTime = startTime
  }

  recordServiceType(type) {
    if (!this.spanEvent) {
      return
    }
    if (!type) {
      return
    }
    if (typeof type.code !== 'number') {
      return
    }
    this.spanEvent.serviceType = type.getCode()
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

  recordNextAsyncId(nextAsyncId) {
    this.spanEvent.nextAsyncId = nextAsyncId
  }

  recordApiId(apiId) {
    this.setApiId0(apiId)
  }

  setApiId0(apiId) {
    if (this.spanEvent && typeof apiId === 'number') {
      this.spanEvent.setApiId(apiId)
    }
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/recorder/AbstractRecorder.java#L70
  recordApi(methodDescriptor, args) {
    if (!methodDescriptor) {
      return
    }

    if (typeof methodDescriptor.getApiId !== 'function') {
      return
    }

    if (methodDescriptor.getApiId() == 0) {
      this.recordAttribute(annotationKey.API, methodDescriptor.getFullName())
    }

    this.setApiId0(methodDescriptor.getApiId())

    if (args && typeof args.length === 'number') {
      this.recordArgs(args)
    }
  }

  recordApiWithParameters(methodDescriptor, parameters) {
    this.recordApi(methodDescriptor)
    this.recordArgs(parameters)
  }

  recordArgs(parameters) {
    if (!parameters || typeof parameters.length !== 'number') {
      return
    }

    const max = Math.min(parameters.length, annotationKey.MAX_ARGS_SIZE)
    try {
      for (let index = 0; index < max; index++) {
        let value = parameters[index]
        this.recordAttribute(AnnotationKeyUtils.getArgs(index), value)
      }
    } catch (error) {
      log.error(`recordArgs error ${error}`)
    }
  }

  recordApiDesc(desc) {
    if (this.spanEvent && desc) {
      this.recordAttribute(annotationKey.API, desc)
      this.recordApiId(0)
    }
  }

  recordApiArguments(key, desc, valueType) {
    if (this.spanEvent && desc) {
      this.recordAttribute(key, desc, valueType)
      this.recordApiId(0)
    }
  }

  recordAttribute(key, value, valueType) {
    if (this.spanEvent && key && typeof key.getCode === 'function' && value) {
      this.spanEvent.addAnnotation(Annotations.of(key.getCode(), value, valueType))
    }
  }

  // https://github.com/pinpoint-apm/pinpoint/blob/74f3066423fc36b21c0f4c806f9d42d6d236665c/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/recorder/AbstractRecorder.java#L55
  recordException(error, isError) {
    if (this.spanEvent && error) {
      const metaInfo = StringMetaService.get(error.name || 'Error')
      const errorMessage = error && typeof error.stack === 'string' ? error.stack.split(/\r?\n/, 2).join('') : ''
      this.spanEvent.exceptionInfo = {
        intValue: metaInfo.stringId,
        stringValue: errorMessage,
      }
      if (this.span && isError) {
        this.span.err = 1
        this.error = error
      }
    }
  }

  recordSqlInfo(sql, bindString) {
    if (typeof sql !== 'string' || this.spanEvent === null) {
      return
    }

    const parsingResult = sqlMetaDataService.cacheSql(sql)
    this.recordSqlParsingResult(parsingResult, bindString)
    return parsingResult
  }

  recordSqlParsingResult(parsingResult, bindString) {
    if (!parsingResult) {
      return
    }

    if (typeof bindString !== 'string') {
      bindString = null
    }

    this.recordSqlParam(new IntStringStringValue(parsingResult.getId(), parsingResult.getOutput(), bindString))
  }

  recordSqlParam(intStringStringValue) {
    const annotation = Annotations.of(annotationKey.SQL_ID.getCode(), intStringStringValue)
    this.spanEvent.addAnnotation(annotation)
  }

  recordEnd() {
    this.ended = true
  }

  getLocalAsyncId() {
    if (!this.asyncId || typeof this.asyncId.nextLocalAsyncId !== 'function') {
      return 
    }
    this.asyncId = this.asyncId.nextLocalAsyncId()
    return this.asyncId
  }
}

module.exports = SpanEventRecorder