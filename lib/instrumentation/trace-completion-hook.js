/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class TraceCompletionHook {
    constructor(config) {
        this.config = config
    }
    /**
     * @param {Trace} trace - ending Trace
     * @param {Object} data - Instrumentation context data (req, res etc)
     */
    onComplete(trace) {

    }
}