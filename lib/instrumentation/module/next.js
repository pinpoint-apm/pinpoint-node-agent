/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const log = require('../../utils/logger')

module.exports = function (agent, version, next) {
    if (!semver.satisfies(version, '>=12.0.0 <13.3.0')) {
        log.debug('next version %s not supported - aborting...', version)
        return next
    }

    return next
}