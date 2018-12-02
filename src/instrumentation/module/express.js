'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const ExpressMethodDescritpor = require('constant/method-descriptor').ExpressMethodDescritpor

module.exports = function(agent, version, express) {
    // if (!semver.satisfies(version, '^1.0.0')) {
    //     console.log('express version %s not supported - aborting...', version)
    //     return express
    // }

  shimmer.wrap(express.Router, 'handle', function (original) {
    return function (req) {
      console.log('express handle !!')
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        // spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApi(ExpressMethodDescritpor.HANDLE)
        // spanEventRecorder.recordDestinationId('EXPRESS')
        // todo. Add on spanRecod
      }

      const result = original.apply(this, arguments)

      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }

      return result
    }
  })
  return express
}
