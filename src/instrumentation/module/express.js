'use strict'

const shimmer = require('shimmer')

module.exports = function(agent, express) {
  shimmer.wrap(express.Router, 'handle', function (original) {
    return function (req) {
      //TODO should move to http
      agent.createNewContext()
      if (agent.currentContext) {
        const spanEventRecorder = agent.currentContext.spanEventRecorder
        spanEventRecorder.recordStartTime(Date.now())
      }
      return original.apply(this, arguments)
    }
  })
  return express
}