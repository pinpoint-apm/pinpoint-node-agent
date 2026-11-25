/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// Records the URI template and HTTP method of a request in the Shared of its TraceRoot, when URI stats are on
class UriStatsShared {
    constructor(uriStatsConfig) {
        this.uriStatsConfig = uriStatsConfig
    }

    // DefaultShared.java: setUriTemplate
    // force is the URI template the user put on the request, recorded only when uriStats.useUserInput is on
    setUriTemplate(shared, uriTemplate, force) {
        if (typeof uriTemplate !== 'string' || uriTemplate.length < 1) {
            return
        }
        if (force && !this.uriStatsConfig.isUriStatsUseUserInput()) {
            return
        }
        if (!force && shared.getEnricher('uriStats.uriTemplate')) {
            return
        }
        shared.setEnricher('uriStats.uriTemplate', uriTemplate)
    }

    // DefaultShared.java: setHttpMethods
    setUriHttpMethod(shared, httpMethod) {
        if (!this.uriStatsConfig.isUriStatsHttpMethodEnabled()) {
            return
        }
        if (typeof httpMethod !== 'string' || httpMethod.length < 1) {
            return
        }
        shared.setEnricher('uriStats.method', httpMethod)
    }
}

const emptyUriStatsShared = Object.freeze({
    setUriTemplate() {},
    setUriHttpMethod() {},
})

module.exports = {
    UriStatsShared,
    emptyUriStatsShared,
}
