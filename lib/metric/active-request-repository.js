/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const SimpleCache = require('../utils/simple-cache')
const ActiveTraceHistogram = require('./active-trace-histogram')
const HistogramSchema = require('./histogram-schema')
const ResponseTimeCollector = require('./response-time-collector')

// DefaultActiveTraceRepository.java
class ActiveRequestRepository {
    constructor() {
        this.activeTraceCache = new SimpleCache()
        this.responseTimeCollector = new ResponseTimeCollector()
    }

    register(localTraceRoot) {
        const id = localTraceRoot.getTransactionId()
        if (typeof id !== 'string' || id.length < 1) {
            return
        }

        this.activeTraceCache.put(id, localTraceRoot)
    }

    remove(localTraceRoot, purgeTime) {
        const id = localTraceRoot.getTransactionId()
        this.activeTraceCache.delete(id)
        this.responseTimeCollector.add(purgeTime - localTraceRoot.getTraceStartTime())
    }

    collectResponseTime() {
        return this.responseTimeCollector.collect()
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