'use strict'

const shimmer = require('shimmer')
const httpShared = require('../http-shared')
const log = require('utils/logger')

module.exports = function(agent, version, https) {

    log.debug('shimming https.Server.prototype.emit function')
    shimmer.wrap(https && https.Server && https.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'https'))

    return https
}
