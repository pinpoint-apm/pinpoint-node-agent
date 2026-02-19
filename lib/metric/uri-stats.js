/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { UriStatsRepositoryBuilder } = require('./uri-stats-repository')

let repository = null
function makeStatsRepository(config) {
    repository = new UriStatsRepositoryBuilder(config).build()
    return repository
}

module.exports = {
    makeStatsRepository,
    getUriStatsRepository: function () {
        return repository ?? UriStatsRepositoryBuilder.nullObject
    }
}