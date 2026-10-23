/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const log = require('../../utils/log/logger')
const httpShared = require('../http-shared')

module.exports = function(agent, version, https) {
  log.debug('shimming https.Server.prototype.emit function')
  shimmer.wrap(https && https.Server && https.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'https'))

  log.debug('shimming https.request function')
  shimmer.wrap(https, 'request', httpShared.traceOutgoingRequest(agent, 'https'))

  return https
}
