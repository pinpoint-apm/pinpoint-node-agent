/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const log = require('../../utils/logger')
const httpShared = require('../http-shared')

module.exports = function(agent, version, https) {
  log.debug('shimming https.Server.prototype.emit function')
  shimmer.wrap(https && https.Server && https.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'https'))

  // https://github.com/nodejs/node/commit/5118f3146643dc55e7e7bd3082d1de4d0e7d5426
  if (semver.gte(version, '9.0.0')) {
    log.debug('shimming https.request function')
    shimmer.wrap(https, 'request', httpShared.traceOutgoingRequest(agent, 'https'))
  }

  return https
}
