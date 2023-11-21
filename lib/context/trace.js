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
const BufferedStorage = require('./buffered-storage')
const SpanChunk = require('./span-chunk')
const log = require('../utils/logger')
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