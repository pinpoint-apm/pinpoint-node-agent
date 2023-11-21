/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const contextManager = require('../../context/context-manager')

class AsyncHooksLocalStorage {
    constructor() {
        contextManager.start()
    }

    run(store, callback) {
        contextManager.setObject(store)
        callback()
    }

    getStore() {
        return contextManager.getObject()
    }

    disable() {
        contextManager.disable()
    }
}

module.exports = AsyncHooksLocalStorage