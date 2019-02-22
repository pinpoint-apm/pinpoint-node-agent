'use strict'

const shimmer = require('shimmer')
const semver = require('semver')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')

module.exports = function (agent, version, bluebird) {
  if (!semver.satisfies(version, '>=2 <4')) {
    log.debug('bluebird version %s not supported - aborting...', version)
    return bluebird
  }
}
