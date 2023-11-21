/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const Span = require('./span')
const DisableSpanEventRecorder = require('./disable-span-event-recorder')
const DisableAsyncTrace = require('./disable-async-trace')

// https://github.com/naver/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/DisableTrace.java
class DisableTrace {
    constructor(traceId, agentInfo, requestData) {
        this.traceId = traceId

        this.span = new Span(traceId, agentInfo, requestData)
        this.sampling = false
    }

    traceBlockBegin() {
        return new DisableSpanEventRecorder()
    }

    traceBlockEnd() {}

    completeSpanEvent() {
    }

    canSampled() {
        return false
    }

    getStartTime() {
        return (this.span && this.span.startTime) || 0
    }

    close() {
        this.closedDisabledTrace = true
    }

    completed() {
        return this.closedDisabledTrace
    }
}

module.exports = DisableTrace