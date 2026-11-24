/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventBuilder = require('./span-event-builder')
const SpanEventRecorder = require('./span-event-recorder')

class SpanEventRecorderFactory {
    constructor(sqlMetadataService) {
        this.sqlMetadataService = sqlMetadataService
    }

    create(stackId, traceRoot, exceptionRecorder) {
        return new SpanEventRecorder(SpanEventBuilder.make(stackId), traceRoot, this.sqlMetadataService, exceptionRecorder)
    }

    createNullObject(traceRoot) {
        return SpanEventRecorder.nullObject(traceRoot)
    }
}

module.exports = SpanEventRecorderFactory
