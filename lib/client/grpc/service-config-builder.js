/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ServiceConfig {
    constructor(agentServiceConfig, metadataServiceConfig) {
        this.agentServiceConfig = agentServiceConfig
        this.metadataServiceConfig = metadataServiceConfig
    }

    getAgentServiceConfig() {
        return this.agentServiceConfig
    }

    getMetadataServiceConfig() {
        return this.metadataServiceConfig
    }
}

// in GrpcTransportConfig.java
const DEFAULT_METADATA_RETRY_MAX_COUNT = 3
class ServiceConfigBuilder {
    static nullObject = new ServiceConfigBuilder()
        .setJSON({
            methodConfig: [
                {
                    name: [
                        { service: 'v1.Agent' },
                        { service: 'v1.Metadata' },
                    ],
                    retryPolicy: {
                        maxAttempts: DEFAULT_METADATA_RETRY_MAX_COUNT,
                        initialBackoff: '1s',
                        maxBackoff: '10s',
                        backoffMultiplier: 2,
                        retryableStatusCodes: [14],
                    },
                },
            ]
        })

    setAgentServiceConfig(config) {
        if (typeof config !== 'string') {
            return this
        }

        this.agentServiceConfig = config
        return this
    }

    setMetadataServiceConfig(config) {
        if (typeof config !== 'string') {
            return this
        }

        this.metadataServiceConfig = config
        return this
    }

    setJSON(config) {
        if (typeof config !== 'object') {
            return this
        }

        this.agentServiceConfig = JSON.stringify(config)
        this.metadataServiceConfig = JSON.stringify(config)
        return this
    }

    build() {
        return new ServiceConfig(this.agentServiceConfig, this.metadataServiceConfig)
    }
}

module.exports = ServiceConfigBuilder