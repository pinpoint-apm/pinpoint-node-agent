/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanRecorder = require('./span-recorder')
const SpanEventRecorder = require('./span-event-recorder')
const Span = require('./span')
const SpanEvent = require('./span-event')
const AsyncTrace = require('./async-trace')
const BufferedStorage = require('./buffered-storage')
const SpanChunk = require('./span-chunk')
const log = require('../utils/logger')
const defaultPredefinedMethodDescriptorRegistry = require('../constant/default-predefined-method-descriptor-registry')
const DisableAsyncTrace = require('./disable-async-trace')
const ServiceType = require('../context/service-type')
const calledTraceBlockEnd = Symbol('called-traceBlockEnd')

class Trace {
  constructor(traceId, agentInfo, dataSender, sampling, requestData) {
    this.traceId = traceId
    this.agentInfo = agentInfo
    this.dataSender = dataSender

    this.span = new Span(traceId, agentInfo, requestData)
    this.spanRecorder = new SpanRecorder(this.span)

    this.spanEventRecorder = null


    const createSpanChunk = SpanChunk.getFactoryMethod(traceId, agentInfo)
    this.storage = new BufferedStorage(dataSender, createSpanChunk)

    this.callStack = []
    this.sequence = 0
    this.sampling = sampling
  }

  traceBlockBegin() {
    const spanEvent = new SpanEvent(this.span, this.sequence)
    spanEvent.depth = this.callStack.length + 1
    spanEvent.startTime = Date.now()
    spanEvent.startElapsed = spanEvent.startTime - this.span.startTime

    this.callStack.push(spanEvent)
    this.sequence++

    this.spanEventRecorder = new SpanEventRecorder(spanEvent, this.span)
    return this.spanEventRecorder
  }

  traceBlockEnd(spanEventRecorder) {
    if (!spanEventRecorder || this.callStack.length < 1) {
      return
    }

    if (spanEventRecorder[calledTraceBlockEnd]) {
      return
    }

    const index = this.callStack.findIndex(item => item === spanEventRecorder.spanEvent)
    if (index < 0) {
      log.error('SpanEvent does not exists in call-stack', spanEventRecorder.spanEvent)
      return
    }

    spanEventRecorder.error && delete spanEventRecorder.error._pinpointCheck

    if (index === this.callStack.length - 1) {
      this.completeSpanEvent(this.callStack.pop())
    } else {
      const spanEvent = this.callStack.splice(index, 1)
      if (spanEvent && spanEvent.length > 0) {
        log.warn('Remove spanEvent from middle of call-stack', spanEvent[0])
        this.completeSpanEvent(spanEvent[0])
      }
    }

    spanEventRecorder[calledTraceBlockEnd] = true
  }

  completeSpanEvent(spanEvent) {
    if (spanEvent && spanEvent.isValid()) {
      spanEvent.markElapsedTime()
      this.storage.storeSpanEvent(spanEvent)
    }
  }

  newAsyncTrace(spanEventRecorder) {
    if (!spanEventRecorder || typeof spanEventRecorder.recordNextAsyncId !== 'function') {
      return new DisableAsyncTrace()
    }
    const asyncId = spanEventRecorder.recordNextAsyncId()
    return this.newAsyncTraceWithId(asyncId)
  }

  newAsyncTraceWithId(asyncId) {
    if (!asyncId) {
      return new DisableAsyncTrace()
    }
    
    const asyncTrace = new AsyncTrace(this.span, asyncId, this.traceId, this.agentInfo, this.dataSender, this.sampling)
    const spanEventRecorder = asyncTrace.traceAsyncBegin()
    spanEventRecorder.recordServiceType(ServiceType.async)
    spanEventRecorder.recordApiId(defaultPredefinedMethodDescriptorRegistry.asyncInvocationMethodDescriptor.getApiId())
    spanEventRecorder.spanEvent.endPoint = null
    spanEventRecorder.spanEvent.destinationId = null
    asyncTrace.storage.storeSpanEvent(spanEventRecorder.spanEvent)
    return asyncTrace
  }

  canSampled() {
    return this.sampling
  }

  getStartTime() {
    return (this.span && this.span.startTime) || 0
  }

  close() {
    this.storage.storeSpan(this.span)
  }

  completed() {
    return this.spanRecorder && this.spanRecorder.span && typeof this.spanRecorder.span.elapsed === 'number'
  }
}

module.exports = Trace