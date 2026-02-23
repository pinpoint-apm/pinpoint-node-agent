/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { TraceCompletionHook } = require('../../instrumentation/trace-completion-hook')

class HttpRequestUriStatsTraceCompletionHook extends TraceCompletionHook {
    onComplete(trace, { req }) {
        if (typeof req['pinpoint.metric.uri-template'] !== 'string') {
            return
        }

        const spanRecorder = trace.getSpanRecorder()
        spanRecorder.recordUriTemplate(req['pinpoint.metric.uri-template'], true)
    }
}

module.exports = {
    HttpRequestUriStatsTraceCompletionHook
}