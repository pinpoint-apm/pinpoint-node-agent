'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

module.exports = function(agent, version, express) {
    if (!semver.satisfies(version, '^1.0.0')) {
        console.log('express version %s not supported - aborting...', version)
        return express
    }

  shimmer.wrap(express.Router, 'handle', function (original) {
    return function (req) {
      if (agent.currentContext) {
        const spanEventRecorder = agent.currentContext.spanEventRecorder
        spanEventRecorder.recordStartTime(Date.now())
        // todo. Add on spanRecod
      }
      return original.apply(this, arguments)
    }
  })
  return express
}
