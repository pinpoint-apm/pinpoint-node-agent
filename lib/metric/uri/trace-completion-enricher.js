/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceCompletionEnricher {
    constructor(repository) {
        this.repository = repository
    }

    /**
     * Handles trace completion by storing URI statistics.
     * @param {Object} trace - The trace object containing root information
     * @param {number} traceCloseTime - The timestamp when the trace was closed
     * @returns {void}
     */
    onComplete(trace, traceCloseTime) {
        if (!trace || !Number.isFinite(traceCloseTime)) {
            return
        }

        this.repository.storeUriStats(trace.getTraceRoot(), traceCloseTime)
    }
}

module.exports = {
    TraceCompletionEnricher
}