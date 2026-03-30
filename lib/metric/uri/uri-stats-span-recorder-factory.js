/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { SpanRecorderFactory } = require('../../context/trace/span-recorder-factory')
const { SpanRecorderEnricher } = require('./span-recorder-enricher')

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

module.exports = { UriStatsSpanRecorderFactory }
