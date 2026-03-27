/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')
const SpanEventRecorder = require('./span-event-recorder')

class SpanEventRecorderFactory {
    constructor(sqlMetadataService, exceptionEnricher) {
        this.sqlMetadataService = sqlMetadataService
        this.exceptionEnricher = exceptionEnricher
    }

    create(stackId, traceRoot) {
        return new SpanEventRecorder(SpanEventBuilder.make(stackId), traceRoot, this.sqlMetadataService, this.exceptionEnricher)
    }

    createNullObject(traceRoot) {
        return SpanEventRecorder.nullObject(traceRoot)
    }
}

module.exports = SpanEventRecorderFactory
