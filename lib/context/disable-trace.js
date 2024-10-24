/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const DisableSpanEventRecorder = require('./disable-span-event-recorder')
const DisableSpanRecorder = require('./disable-span-recorder')

// https://github.com/naver/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/DisableTrace.java
class DisableTrace {
    constructor(traceRoot) {
        this.traceRoot = traceRoot
        this.spanRecorder = new DisableSpanRecorder()
    }

    getTraceRoot() {
        return this.traceRoot
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
        return 0
    }

    close() {
    }
}

module.exports = DisableTrace