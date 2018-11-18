'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, express) {
    if (!semver.satisfies(version, '^1.0.0')) {
        console.log('express version %s not supported - aborting...', version)
        return express
    }

  shimmer.wrap(express.Router, 'handle', function (original) {
    return function (req) {
      const trace = agent.traceContext.currentTraceObject()
      if (trace) {
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApi('express.get')
        // todo. Add on spanRecod
      }

      const result = original.apply(this, arguments)

      trace.traceBlockEnd()

      return result
    }
  })
  return express
}
