/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SimpleCache = require('../utils/simple-cache')
const ActiveTraceHistogram = require('./active-trace-histogram')
const HistogramSchema = require('./histogram-schema')

// DefaultActiveTraceRepository.java
class ActiveRequestRepository {
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

    getCurrentActiveTraceHistogram() {
        const currentTime = Date.now()
        return this.getActiveTraceHistogram(currentTime)
    }

    getActiveTraceHistogram(currentTime) {
        const histogram = new ActiveTraceHistogram(HistogramSchema.NORMAL_SCHEMA)
        this.activeTraceCache.getAll().forEach((traceRoot) => {
            const elapsedTime = currentTime - traceRoot.getTraceStartTime()
            histogram.increase(elapsedTime)
        })
        return histogram
    }
}

module.exports = new ActiveRequestRepository()