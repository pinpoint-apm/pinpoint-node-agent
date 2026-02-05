/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsRepositoryBuilder } = require('./uri-stats-repository')

let repository = null
function initializeStats(config) {
    repository = new UriStatsRepositoryBuilder(config).build()
}

module.exports = {
    initializeStats,
    getUriStatsRepository: function () {
        return repository ?? UriStatsRepositoryBuilder.nullObject
    }
}