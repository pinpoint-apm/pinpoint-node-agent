/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class ProtocolVersionConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const version = this.config?.collector?.protocolVersion
        if (typeof version === 'string' && version.trim().toLowerCase() === 'v3') {
            return new ProtocolV3Config()
        }
        return new ProtocolV4Config()
    }
}

// Java agent: pinpoint.modules.uid.version v3 sends ProtocolVersion.V1 (100), v4 sends ProtocolVersion.V4 (400)
class ProtocolV3Config {
    getVersion() {
        return 'v3'
    }

    getProtocolVersion() {
        return '100'
    }
}

class ProtocolV4Config {
    getVersion() {
        return 'v4'
    }

    getProtocolVersion() {
        return '400'
    }
}

module.exports = {
    ProtocolVersionConfigBuilder,
    ProtocolV3Config,
    ProtocolV4Config
}
