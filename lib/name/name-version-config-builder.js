/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { valueOfString } = require('../config-builder')

// Java agent: NameVersion (pinpoint.modules.uid.version)
class NameV3Config {
    getVersion() {
        return 'v3'
    }

    getProtocolVersion() {
        return '100'
    }
}

class NameV4Config {
    getVersion() {
        return 'v4'
    }

    getProtocolVersion() {
        return '400'
    }
}

class NameVersionConfigBuilder {
    constructor(config) {
        this.config = config
    }

    build() {
        const version = valueOfString('PINPOINT_UID_VERSION') ?? this.config?.uidVersion
        if (typeof version === 'string' && version.trim().toLowerCase() === 'v3') {
            return new NameV3Config()
        }
        return new NameV4Config()
    }
}

module.exports = {
    NameVersionConfigBuilder,
    NameV3Config,
    NameV4Config
}
