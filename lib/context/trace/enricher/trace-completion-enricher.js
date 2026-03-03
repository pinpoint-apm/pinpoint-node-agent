/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceCompletionEnricher {
    constructor(config) {
        this.config = config
    }

    /**
     * @param {Trace} trace - ending Trace
     */
    onComplete(trace) {

    }
}

module.exports = {
    TraceCompletionEnricher
}