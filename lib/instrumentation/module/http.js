/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const log = require('../../utils/logger')
const httpShared = require('../http-shared')

module.exports = function(agent, version, http) {
  log.debug('shimming http.Server.prototype.emit function')
  shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'http'))

  log.debug('shimming http.request function')
  shimmer.wrap(http, 'request', httpShared.traceOutgoingRequest(agent, 'http'))

  return http
}