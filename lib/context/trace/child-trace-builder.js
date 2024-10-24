/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanEventRecorder = require('./span-event-recorder')
const Trace = require('./trace2')

class ChildTrace extends Trace {
    constructor(spanBuilder, repository, localAsyncId) {
        super(spanBuilder, repository)
        this.localAsyncId = localAsyncId
    }
}

class ChildTraceBuilder {
    constructor(traceRoot, localAsyncId) {
        this.traceRoot = traceRoot
        this.localAsyncId = localAsyncId

        this.callStack = []
        this.closed = false

        this.spanEventRecorder = SpanEventRecorder.nullObject()
    }
}

module.exports = ChildTraceBuilder