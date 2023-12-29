/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { AsyncLocalStorage } = require('node:async_hooks')

class AsyncContextLocalStorage {
    constructor() {
        this.storage = new AsyncLocalStorage()
    }

    run(store, callback) {
        this.storage.run(store, callback)
    }

    getStore() {
        return this.storage.getStore()
    }

    disable() {
        this.storage.disable()
    }

    enterWith(store) {
        this.storage.enterWith(store)
    }
}

module.exports = AsyncContextLocalStorage