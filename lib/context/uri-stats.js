/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsRepositoryBuilder } = require('../metric/uri-stats-repository')

let repositories = null
function initializeStats(config) {
    repositories = new UriStats(config)
}

class UriStats {
    constructor(config) {
        this.uriStatsRepository = new UriStatsRepositoryBuilder(config).build()
    }
}

module.exports = {
    initializeStats,
    getUriStatsRepository: function () {
        return repositories?.uriStatsRepository ?? UriStatsRepositoryBuilder.nullObject
    }
}