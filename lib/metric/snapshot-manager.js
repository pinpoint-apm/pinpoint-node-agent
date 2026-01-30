/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class SnapshotManager {
    constructor(snapshotFactory, timestampExtractor) {
        this.snapshotFactory = snapshotFactory
        this.timestampExtractor = timestampExtractor
        this.current = null
    }

    getCurrent(timestamp) {
        if (!this.current) {
            this.current = this.snapshotFactory(timestamp)
        }
        return this.current
    }

    takeSnapshot(timestamp) {
        if (!this.current) {
            return null
        }

        const currentTimestamp = this.timestampExtractor(this.current)

        if (timestamp <= currentTimestamp) {
            return null
        }

        const completedSnapshot = this.current
        this.current = null
        return completedSnapshot
    }
}

module.exports = {
    SnapshotManager
}