'use strict'

const shimmer = require('shimmer')
const httpShared = require('../http-shared')

module.exports = function(agent, version, https) {

    console.debug('shimming https.Server.prototype.emit function')
    shimmer.wrap(https && https.Server && https.Server.prototype, 'emit', httpShared.instrumentRequest(agent, 'https'))

    return https
}
