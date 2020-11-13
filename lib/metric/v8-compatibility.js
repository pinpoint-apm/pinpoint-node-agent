/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const semver = require('semver')

class V8Compatibility {
    constructor() {
        this.initialize()
    }

    initialize() {
        const nodeVersion = this.getNodeVersion()
        if (!semver.satisfies(nodeVersion, '>=9.0.0')) {
            try {
                new ArrayBuffer()
                this.disableModule = false
            } catch (error) {
                this.disableModule = true
            }
        } else {
            this.disableModule = false
        }
    }

    disabled() {
        return this.disableModule
    }

    enabled() {
        return !this.disabled()
    }

    getNodeVersion() {
        return process.versions.node
    }
}

const compatibility = new V8Compatibility()
module.exports = compatibility