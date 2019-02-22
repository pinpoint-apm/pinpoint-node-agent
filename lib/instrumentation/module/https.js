'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const log = require('../../utils/logger')
const httpShared = require('../http-shared')

module.exports = function(agent, version, https) {
  log.debug('shimming https.Server.prototype.emit function')
  shimmer.wrap(https && https.Server && https.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'https'))

  if (semver.gte(version, '9.0.0')) {
    log.debug('shimming https.request function')
    shimmer.wrap(https, 'request', httpShared.traceOutgoingRequest(agent, 'https'))
  }

  return https
}
