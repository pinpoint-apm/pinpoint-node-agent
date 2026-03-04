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
        if (!args || args.length < 1) {
            return
        }

        if (moduleName === 'http' && this.config.isUriStatsUseUserInput()) {
            const req = args[0]
            this.setUriTemplate(traceRoot, req['pinpoint.metric.uri-template'], true)
        } else if (moduleName === 'express') {
            const req = args[0]
            this.setUriTemplate(traceRoot, req.route?.path, false)
            this.setUriHttpMethod(traceRoot, req.method)
        } else if (moduleName === 'koa') {
            this.setUriTemplate(traceRoot, args[0], false)
            this.setUriHttpMethod(traceRoot, args[1])
        }
    }

    setUriTemplate(traceRoot, uriTemplate, force) {
        if (typeof uriTemplate !== 'string' || uriTemplate.length < 1) {
            return
        }

        if (!force && traceRoot.getEnricher('uriStats.uriTemplate')) {
            return
        }

        traceRoot.setEnricher('uriStats.uriTemplate', uriTemplate)
    }

    setUriHttpMethod(traceRoot, httpMethod) {
        if (typeof httpMethod !== 'string' || httpMethod.length === 0) {
            return
        }

        traceRoot.setEnricher('uriStats.method', httpMethod)
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