/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const AsyncContextLocalStorage = require('./async-context-local-storage')
class LocalStorage {
    constructor() {
        this.storage = new AsyncContextLocalStorage()
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

    enterWith(store) {
        this.storage.enterWith(store)
    }
}

class EmptyLocalStorage {
    run() {
    }

    getStore() {
    }

    disable() {
    }

    enterWith() {
    }
}

module.exports = new LocalStorage()