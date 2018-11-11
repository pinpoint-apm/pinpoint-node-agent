'use strict'

const shimmer = require('shimmer')
// const httpShared = require('../http-shared')    // Todo: Common binding (e.g. http, https ... )

module.exports = function(agent, http) {
    shimmer.wrap(http && http.Server && http.Server.prototype, 'emit', function(original) {
        return function (event ,req, res) {
            if (event === 'request') {
                agent.createNewContext()
            }
            return original.apply(this, arguments)
        }
    })
    return http
}

