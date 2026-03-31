/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../../utils/log/logger')

class CompositeTraceCompletionEnricher {
    constructor(enrichers) {
        this.enrichers = enrichers
    }

    static make(enrichers = []) {
        return new CompositeTraceCompletionEnricher(
            enrichers.filter(e => typeof e.onComplete === 'function')
        )
    }

    onComplete(trace, traceCloseTime) {
        for (const enricher of this.enrichers) {
            try {
                enricher.onComplete(trace, traceCloseTime)
            } catch (e) {
                log.error('enricher failed', e)
            }
        }
    }
}

module.exports = { CompositeTraceCompletionEnricher }
