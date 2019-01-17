'use strict'

const shimmer = require('shimmer')
const log = require('../../utils/logger')
const httpShared = require('../http-shared')

module.exports = function(agent, version, http) {
  log.debug('shimming http.Server.prototype.emit function')
  shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'http'))

  log.debug('shimming http.request function')
  shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest(agent, 'http'))

  // Todo. Header 에 기록하려면 이곳에다가 해야할 듯.

  return http
}

