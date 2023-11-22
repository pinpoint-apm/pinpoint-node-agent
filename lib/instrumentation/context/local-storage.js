/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const AsyncContextLocalStorage = require('./async-context-local-storage')
const AsyncHooksLocalStorage = require('./async-hooks-local-storage')
const { getConfig } = require('../../config')
class LocalStorage {
    constructor() {
        this.storage = this.createLocalStorage()
    }

    createLocalStorage() {
        const config = getConfig()
        if (config && !config.enable) {
            return new EmptyLocalStorage()
        }

        if (!semver.satisfies(process.version, '>=16.4.0')) {
            return new AsyncHooksLocalStorage()
        }
        return new AsyncContextLocalStorage()
    }

    run(store, callback) {
        return this.storage.run(store, callback)
    }

    getStore() {
        return this.storage.getStore()
    }

    disable() {
        this.storage.disable()
    }
}

class EmptyLocalStorage {
    run() {
    }

    getStore() {
    }

    disable() {
    }
}

module.exports = new LocalStorage()