'use strict'

const shimmer = require('shimmer')
const httpShared = require('../http-shared')    // Todo: Common binding (e.g. http, https ... )
const log = require('utils/logger')

module.exports = function(agent, version, http) {

    log.debug('shimming http.Server.prototype.emit function')
    shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'http'))

    log.debug('shimming http.request function')
    shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest(agent, 'http'))

    return http
}

