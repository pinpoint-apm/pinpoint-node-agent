/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const TraceContext = require('./trace-context')
const { SpanRecorderFactory } = require('./trace/span-recorder-factory')
const SpanEventRecorderFactory = require('./trace/span-event-recorder-factory')
const { CompositeTraceCompletionEnricher } = require('./trace/composite-trace-completion-enricher')
const { IntIdParsingResultFactory } = require('./trace/parsing-result-factory')
const { SqlMetadataService } = require('../instrumentation/sql/sql-metadata-service')
const { exceptionEnricherNullObject } = require('./trace/exception-enricher')

class TraceContextBuilder {
    constructor(config) {
        this.config = config
        this.enrichers = []
    }

    setDataSender(dataSender) {
        this.dataSender = dataSender
        return this
    }

    setSpanRecorderFactory(spanRecorderFactory) {
        this.spanRecorderFactory = spanRecorderFactory
        return this
    }

    setParsingResultFactory(parsingResultFactory) {
        this.parsingResultFactory = parsingResultFactory
        return this
    }

    addEnricher(enricher) {
        this.enrichers.push(enricher)
        return this
    }

    build(agentStartTime) {
        const spanRecorderFactory = this.spanRecorderFactory ?? new SpanRecorderFactory(this.config)
        const parsingResultFactory = this.parsingResultFactory ?? new IntIdParsingResultFactory()
        const sqlMetadataService = new SqlMetadataService(this.dataSender, parsingResultFactory)
        const exceptionSpanEventEnricher = this.enrichers.find(e => typeof e.recordException === 'function') ?? exceptionEnricherNullObject
        const spanEventRecorderFactory = new SpanEventRecorderFactory(sqlMetadataService, exceptionSpanEventEnricher)
        const traceCompletionEnricher = CompositeTraceCompletionEnricher.make(this.enrichers)
        return new TraceContext(this.dataSender, this.config, traceCompletionEnricher, spanRecorderFactory, spanEventRecorderFactory, agentStartTime)
    }
}

module.exports = TraceContextBuilder
