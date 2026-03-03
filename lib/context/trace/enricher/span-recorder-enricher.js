/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SpanRecorderEnricher {
    constructor(config) {
        this.config = config
    }

    record(moduleName, traceRoot, ...args) {
        if (moduleName !== 'http') {
            return
        }

        if (this.config.isUriStatsUseUserInput()) {
            const req = args[0]
            const uriTemplate = req?.['pinpoint.metric.uri-template']
            if (typeof uriTemplate !== 'string' || uriTemplate.length < 1) {
                return
            }

            traceRoot.setEnricher('uriStats.uriTemplate', uriTemplate)
            return
        }
    }
}

class SpanRecorderEnricherNullObject {
    record() {

    }
}

module.exports = {
    SpanRecorderEnricher,
    nullObject: new SpanRecorderEnricherNullObject()
}