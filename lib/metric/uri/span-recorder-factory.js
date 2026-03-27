/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SpanRecorder = require('../../context/trace/span-recorder')
const DisableSpanRecorder = require('../../context/disable-span-recorder')
const { SpanRecorderEnricher } = require('./span-recorder-enricher')

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

class UriStatsSpanRecorderFactory extends SpanRecorderFactory {
    constructor(config, uriStatsConfig) {
        super(config)
        this.uriStatsConfig = uriStatsConfig
    }

    create(spanBuilder) {
        const spanRecorder = super.create(spanBuilder)
        return new SpanRecorderEnricher(spanRecorder, this.uriStatsConfig, spanBuilder.getTraceRoot())
    }

    createDisable(traceRoot) {
        const spanRecorder = super.createDisable(traceRoot)
        return new SpanRecorderEnricher(spanRecorder, this.uriStatsConfig, traceRoot)
    }
}

module.exports = { SpanRecorderFactory, UriStatsSpanRecorderFactory }
