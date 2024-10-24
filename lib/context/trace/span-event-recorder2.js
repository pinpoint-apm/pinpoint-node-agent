/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../../instrumentation/context/annotation/annotations')
const SpanEventBuilder = require('./span-event-builder')
const AsyncId = require('../../context/async-id')

class SpanEventRecorder {
    static nullObject() {
        return new SpanEventRecorder(SpanEventBuilder.nullObject())
    }

    constructor(spanEventBuilder) {
        this.spanEventBuilder = spanEventBuilder
    }

    makeSequenceAndDepthGrowth() {
        return new SpanEventRecorder(this.spanEventBuilder.makeSequenceAndDepthGrowth())
    }

    getSpanEventBuilder() {
        return this.spanEventBuilder
    }

    recordServiceType(serviceType) {
        this.spanEventBuilder.addAnnotation(serviceType)
    }

    recordApiDesc(desc) {
        this.recordAttribute(annotationKey.API, desc)
        this.recordApiId(0)
    }

    recordAttribute(key, value) {
        if (!key || typeof key.getCode !== 'function' || !value) {
            return
        }
        this.spanEventBuilder.addAnnotation(Annotations.of(key.getCode(), value))
    }

    recordApiId(apiId) {
        this.setApiId0(apiId)
    }

    setApiId0(apiId) {
        this.spanEventBuilder.setApiId(apiId)
    }

    recordNextAsyncId() {
        this.asyncId = this.asyncId.sequenceNextLocalAsyncId()
        this.spanEventBuilder.setNextAsyncId(this.asyncId.getAsyncId())
    }

    getNextAsyncId() {
        const nextAsyncId = this.spanEventBuilder.getAsyncId()
        if (!nextAsyncId) {
            const asyncId = AsyncId.make()
            this.spanEventBuilder.setAsyncId(asyncId)
            return asyncId
        }
        return nextAsyncId
    }
}

module.exports = SpanEventRecorder