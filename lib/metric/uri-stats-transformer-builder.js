/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const nullUri = '/NULL'
class MethodAwareUriStatsTransformer {
    transform(uri, method) {
        if (!uri || uri.length === 0) {
            return nullUri
        }
        return `${method} ${uri}`
    }
}

class PlainUriStatsTransformer {
    transform(uri) {
        if (!uri || uri.length === 0) {
            return nullUri
        }
        return uri
    }
}

class UriStatsTransformerBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        if (!this.config.isUriStatsHttpMethodEnabled()) {
            return new PlainUriStatsTransformer()
        }
        return new MethodAwareUriStatsTransformer()
    }
}

module.exports = {
    PlainUriStatsTransformer,
    MethodAwareUriStatsTransformer,
    UriStatsTransformerBuilder
}