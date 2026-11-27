/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const log = require('../utils/log/logger')
const { isDecompressorUnavailable } = require('./grpc-errors')

// StatGrpcDataSender.java
class StatsStreamClient {
    constructor(statsClient, uncompressedStatsClient = statsClient) {
        this.statsClient = statsClient
        this.uncompressedStatsClient = uncompressedStatsClient
    }

    sendAgentStat(options, callback) {
        const compressed = this.statsClient !== this.uncompressedStatsClient
        return this.statsClient.sendAgentStat(options, (error, response) => {
            if (compressed && isDecompressorUnavailable(error)) {
                this.fallbackToUncompressed(error)
            }
            callback(error, response)
        })
    }

    fallbackToUncompressed(error) {
        if (this.statsClient === this.uncompressedStatsClient) {
            return
        }

        this.statsClient = this.uncompressedStatsClient
        log.getLogger().warn(`The collector does not accept gzip stats streams (${error.details}), so they are sent uncompressed from now on.`)
    }
}

module.exports = StatsStreamClient
