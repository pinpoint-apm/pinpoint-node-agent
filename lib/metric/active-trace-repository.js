/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SimpleCache = require('../utils/simple-cache')

// DefaultActiveTraceRepository.java
class ActiveTraceRepository {
    constructor() {
        this.activeTraceCache = new SimpleCache()
    }

    register(localTraceRoot) {
        const id = localTraceRoot.getTransactionId()
        if (typeof id !== 'string' || id.length < 1) {
            return
        }

        this.activeTraceCache.put(id, localTraceRoot)
    }

    remove(localTraceRoot) {
        const id = localTraceRoot.getTransactionId()
        this.activeTraceCache.delete(id)
    }
}

module.exports = ActiveTraceRepository