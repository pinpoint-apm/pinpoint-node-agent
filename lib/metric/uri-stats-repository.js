/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsInfoBuilder } = require('./uri-stats-info-builder')
const { SnapshotManager } = require('./snapshot-manager')
const { UriStatsSnapshot } = require('./uri-stats-snapshot')
const DateNow = require('../support/date-now')

// Default maximum number of distinct URIs tracked per snapshot.
// 1024 is a power of two, providing a reasonable balance between memory usage
// and the need to cover typical production URI cardinality without tuning.
const defaultCapacity = 1024

// Default aggregation window for URI statistics in milliseconds.
// 30 seconds is a common metrics collection interval that smooths short spikes
// while still providing timely visibility into URI performance.
const defaultTimeWindow = 30000

// Maximum number of completed snapshots to retain in memory.
// With a 30-second window, 4 snapshots keep roughly the last 2 minutes of data
// while keeping memory bounded and polling latency low.
const snapshotLimit = 4

class UriStatsRepository {
    constructor(capacity = defaultCapacity, timeWindow = defaultTimeWindow, config) {
        this.capacity = capacity
        this.timeWindow = timeWindow
        this.completedSnapshotQueue = []
        this.snapshotManager = new SnapshotManager(
            (baseTimestamp) => new UriStatsSnapshot(baseTimestamp, this.capacity),
            (snapshot) => snapshot.getBaseTimestamp()
        )
        this.config = config
    }

    storeUriStats(spanBuilder, traceEndTime) {
        const uriTemplate = spanBuilder.getUriTemplate()
        if (!uriTemplate) {
            return
        }

        const traceRoot = spanBuilder.getTraceRoot()
        const traceStartTime = traceRoot.getTraceStartTime()

        const builder = new UriStatsInfoBuilder(uriTemplate, traceStartTime, traceEndTime)
        const httpMethod = spanBuilder.getHttpMethod()
        if (httpMethod) {
            builder.setMethod(httpMethod)
        }

        if (traceRoot.hasErrorCode()) {
            builder.errorResponse()
        }
        builder.setConfig(this.config)

        this.store(builder.build())
    }

    store(uriStatsInfo) {
        if (!uriStatsInfo) {
            return
        }

        const baseTimestamp = this.calculateBaseTimestamp(DateNow.now())

        this.checkAndFlushSnapshot(baseTimestamp)

        const snapshot = this.snapshotManager.getCurrent(baseTimestamp)
        snapshot.add(uriStatsInfo)
    }

    calculateBaseTimestamp(timestamp) {
        return Math.floor(timestamp / this.timeWindow) * this.timeWindow
    }

    checkAndFlushSnapshot(timestamp) {
        const completedSnapshot = this.snapshotManager.takeSnapshot(timestamp)
        if (completedSnapshot) {
            this.addCompletedSnapshot(completedSnapshot)
        }
    }

    addCompletedSnapshot(snapshot) {
        if (this.completedSnapshotQueue.length >= snapshotLimit) {
            this.completedSnapshotQueue.shift()
        }
        this.completedSnapshotQueue.push(snapshot)
    }

    poll() {
        const baseTimestamp = this.calculateBaseTimestamp(DateNow.now())
        this.checkAndFlushSnapshot(baseTimestamp)
        return this.completedSnapshotQueue.shift()
    }
}

class NullObjectRepository {
    storeUriStats() {
        // do nothing
    }

    poll() {

    }
}

class UriStatsRepositoryBuilder {
    static nullObject = new NullObjectRepository()

    constructor(config) {
        this.config = config
    }

    build() {
        if (this.config.isUriStatsEnabled() === false) {
            return UriStatsRepositoryBuilder.nullObject
        }

        return new UriStatsRepository(defaultCapacity, defaultTimeWindow, this.config)
    }
}

module.exports = {
    UriStatsRepository,
    UriStatsRepositoryBuilder
}