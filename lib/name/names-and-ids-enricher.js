/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

// https://kubernetes.io/docs/concepts/overview/working-with-objects/names/
class NamesAndIdsEnricher {
    constructor(protocolVersionConfig) {
        this.protocolVersionConfig = protocolVersionConfig
    }

    enrichMetadata(metadata) {
        metadata.add('protocol.version', this.protocolVersionConfig.getProtocolVersion())
    }
}

module.exports = { NamesAndIdsEnricher }
