/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../../instrumentation/context/annotation/annotations')
const SpanEventBuilder = require('./span-event-builder')
const log = require('../../utils/logger')
const AnnotationKeyUtils = require('../annotation-key-utils')

class SpanEventRecorder {
    static nullObject() {
        return new SpanEventRecorder(SpanEventBuilder.nullObject())
    }

    constructor(spanEventBuilder) {
        this.spanEventBuilder = spanEventBuilder
    }

    getSpanEventBuilder() {
        return this.spanEventBuilder
    }

    recordServiceType(serviceType) {
        this.spanEventBuilder.setServiceType(serviceType.getCode())
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
        return this.spanEventBuilder.getAsyncId()
    }

    recordNextSpanId(nextSpanId) {
        if (nextSpanId == '-1') {
            return
        }
        this.spanEventBuilder.setNextSpanId(nextSpanId)
    }

    recordDestinationId(destinationId) {
        this.spanEventBuilder.setDestinationId(destinationId)
    }

    recordApi(methodDescriptor, args) {
        if (typeof methodDescriptor?.getApiId !== 'function'
            || typeof methodDescriptor?.getFullName !== 'function'
            || typeof methodDescriptor?.getApiDescriptor !== 'function') {
            return
        }

        if (methodDescriptor.getApiId() == 0) {
            this.recordAttribute(annotationKey.API, methodDescriptor.getFullName())
        }

        this.spanEventBuilder.setApiId(methodDescriptor.getApiId())
        this.recordArgs(args)
    }

    recordArgs(args) {
        if (typeof args?.length !== 'number') {
            return
        }

        const max = Math.min(args.length, annotationKey.MAX_ARGS_SIZE)
        try {
            for (let index = 0; index < max; index++) {
                let value = args[index]
                this.recordAttribute(AnnotationKeyUtils.getArgs(index), value)
            }
        } catch (error) {
            log.error(`recordArgs error ${error}`)
        }
    }
}

module.exports = SpanEventRecorder