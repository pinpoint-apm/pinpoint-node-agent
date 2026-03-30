/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanRecorder = require('./span-recorder')
const DisableSpanRecorder = require('../disable-span-recorder')

class SpanRecorderFactory {
    constructor(config) {
        this.config = config
    }

    create(spanBuilder) {
        return new SpanRecorder(spanBuilder, this.config)
    }

    createDisable(traceRoot) {
        return new DisableSpanRecorder(traceRoot, this.config)
    }
}

module.exports = { SpanRecorderFactory }
