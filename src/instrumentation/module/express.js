'use strict'

const shimmer = require('shimmer')

module.exports = function(agent, express) {
  console.log('agent >', agent)
  shimmer.wrap(express.Router, 'handle', function (original) {
    return function (req) {
      const spanEventRecorder = agent.traceContext.spanEventRecorder
      spanEventRecorder.recordStartTime(Date.now())
      return original.apply(this, arguments)
    }
  })
  return express
}