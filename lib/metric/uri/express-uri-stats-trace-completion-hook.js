/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { TraceCompletionHook } = require('../../instrumentation/trace-completion-hook')

class ExpressUriStatsTraceCompletionHook extends TraceCompletionHook {
    onComplete(trace, { path, method }) {
        const spanRecorder = trace.getSpanRecorder()
        spanRecorder.recordUriTemplate(path)

        if (this.config.isUriStatsHttpMethodEnabled()) {
            spanRecorder.recordUriHttpMethod(method)
        }
    }
}

module.exports = {
    ExpressUriStatsTraceCompletionHook
}