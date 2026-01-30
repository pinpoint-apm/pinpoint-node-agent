/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsTransformerBuilder } = require('./uri-stats-transformer-builder')

class UriStatsInfo {
    constructor(uri, responseOk, traceStartTime, traceEndTime) {
        this.uri = uri
        this.responseOk = responseOk
        this.traceStartTime = traceStartTime
        this.traceEndTime = traceEndTime
    }

    getUri() {
        return this.uri
    }

    getElapsed() {
        return this.traceEndTime - this.traceStartTime
    }

    isFailed() {
        return this.responseOk !== true
    }
}

class UriStatsInfoBuilder {
    constructor(uriTemplate, traceStartTime, traceEndTime) {
        this.uriTemplate = uriTemplate
        this.responseOk = true
        this.traceStartTime = traceStartTime
        this.traceEndTime = traceEndTime
    }

    setConfig(config) {
        this.config = config
        return this
    }

    setMethod(method) {
        this.method = method
        return this
    }

    errorResponse() {
        this.responseOk = false
        return this
    }

    build() {
        const uriStatsTransformer = new UriStatsTransformerBuilder(this.config).build()
        const uri = uriStatsTransformer.transform(this.uriTemplate, this.method)
        return new UriStatsInfo(uri, this.responseOk, this.traceStartTime, this.traceEndTime)
    }
}

module.exports = {
    UriStatsInfo,
    UriStatsInfoBuilder
}