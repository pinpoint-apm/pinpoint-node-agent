/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsInfoBuilder } = require('./uri-stats-info-builder')

class UriStatsRepository {
    storeUriStats(spanBuilder, traceEndTime) {
        const uriTemplate = spanBuilder.getUriTemplate()
        if (!uriTemplate) {
            return
        }

        const traceRoot = spanBuilder.getTraceRoot()
        const traceStartTime = traceRoot.getTraceStartTime()
        const uriStatsInfoBuilder = new UriStatsInfoBuilder(uriTemplate, traceStartTime, traceEndTime)
        const httpMethod = spanBuilder.getHttpMethod()
        if (httpMethod) {
            uriStatsInfoBuilder.setMethod(httpMethod)
        }
    }
}

class NullObjectRepository {
    storeUriStats() {
        // do nothing
    }
}

class UriStatsRepositoryBuilder {
    static nullObject = new NullObjectRepository()

    constructor(config) {
        this.config = config
    }

    build() {
        if (this.config.isUriStatsEnabled() === false) {
            return UriStatsRepositoryBuilder.nullObject
        }

        return new UriStatsRepository()
    }
}

module.exports = {
    UriStatsRepository,
    UriStatsRepositoryBuilder
}