/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
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

    enterWith(store) {
        contextManager.setObject(store)
    }
}

module.exports = AsyncHooksLocalStorage