/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'
const SimpleCache = require('../../utils/simple-cache')
class ActiveRequestRepository {
    constructor() {
        this.cache = new SimpleCache()
    }

    registry(traceRoot) {
        this.cache.put(traceRoot.transactionId, traceRoot)
    }

    remove(traceRoot) {
        this.cache.delete(traceRoot.transactionId)
    }
}

module.exports = new ActiveRequestRepository()