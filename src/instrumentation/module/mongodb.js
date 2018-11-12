'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const SERVER_FNS = ['insert', 'update', 'remove', 'auth']
const CURSOR_FNS_FIRST = ['_find', '_getmore']

module.exports = function(agent, version, mongodb) {
    if (!semver.satisfies(version, '>=1.0.0')) {
        return mongodb
    }

    if (mongodb.Server) {
        // todo. command & query
    }

    if (mongodb.Cursor) {
        // todo. only cursor
    }

    return mongodb
}
