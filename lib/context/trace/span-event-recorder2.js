/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const annotationKey = require('../../constant/annotation-key')
const Annotations = require('../../instrumentation/context/annotation/annotations')
const SpanEventBuilder = require('./span-event-builder')
const log = require('../../utils/log/logger')
const AnnotationKeyUtils = require('../annotation-key-utils')
const sqlMetadataService = require('../../instrumentation/sql/sql-metadata-service')
const stringMetaService = require('../string-meta-service')
const AsyncId = require('../async-id')

class SpanEventRecorder {
    static nullObject(traceRoot) {
        return new SpanEventRecorder(SpanEventBuilder.nullObject(), traceRoot)
    }

    constructor(spanEventBuilder, traceRoot) {
        this.spanEventBuilder = spanEventBuilder
        this.traceRoot = traceRoot
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

    getNextAsyncId() {
        let nextAsyncId = this.spanEventBuilder.getAsyncId()
        if (!nextAsyncId) {
            nextAsyncId = AsyncId.make()
            this.spanEventBuilder.setAsyncId(nextAsyncId)
        }
        return nextAsyncId
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

    recordEndPoint(endPoint) {
        this.spanEventBuilder.setEndPoint(endPoint)
    }

    recordException(error, markError) {
        if (typeof error?.name !== 'string') {
            return
        }

        const metaInfo = stringMetaService.get(error.name || 'Error')
        const errorMessage = error && typeof error.stack === 'string' ? error.stack.split(/\r?\n/, 2).join('') : ''
        this.spanEventBuilder.setExceptionInfo(metaInfo.stringId, errorMessage)
        if (markError) {
            const shared = this.traceRoot.getShared()
            shared.maskErrorCode(1)
        }
    }

    recordSqlInfo(sql, bindString) {
        if (typeof sql !== 'string' || this.spanEvent === null) {
            return
        }

        const parsingResult = sqlMetadataService.cacheSql(sql)
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

        const annotation = parsingResult.newSqlAnnotation(bindString)
        this.spanEventBuilder.addAnnotation(annotation)
    }
}

module.exports = SpanEventRecorder