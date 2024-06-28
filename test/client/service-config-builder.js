/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ServiceConfig {
    
}

class ServiceConfigBuilder {
    setAgentClient(config) {
        this.agentClient = config
        return this
    }

    setMetadataClient(config) {
        this.metadataClient = config
        return this
    }

    build() {
        return new ServiceConfig()
    }
}

module.exports = ServiceConfigBuilder