/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://github.com/naver/pinpoint/blob/master/profiler/src/main/java/com/navercorp/pinpoint/profiler/context/DisableTrace.java
class DisableTrace {
    constructor(traceId) {
        this.traceId = traceId
        this.sampling = false
    }

    canSampled() {
        return false
    }
}

module.exports = DisableTrace