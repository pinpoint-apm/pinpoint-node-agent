'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const ExpressMethodDescritpor = require('constant/method-descriptor').ExpressMethodDescritpor

const patched = new Set()

module.exports = function(agent, version, express) {
    // if (!semver.satisfies(version, '^1.0.0')) {
    //     console.log('express version %s not supported - aborting...', version)
    //     return express
    // }
  function patchLayer(layer) {
    if (!patched.has(layer.name)) {
      patched.add(layer.name)
      shimmer.wrap(layer, 'handle', function (original) {
        if (original.length !== 4) return original
        return function (err, req, res, next) {
          if (err) {
            const trace = agent.traceContext.currentTraceObject()
            const spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceTypeCode.express)
            spanEventRecorder.recordApi(ExpressMethodDescritpor.HANDLE)
            spanEventRecorder.recordException(err)
            trace.traceBlockEnd(spanEventRecorder)
            return original.apply(this, arguments)
          }

          const trace = agent.traceContext.currentTraceObject()
          let spanEventRecorder = null
          if (trace) {
            spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceTypeCode.express)
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
    }
  }


  console.log('simm process_params')
  shimmer.wrap(express.Router, 'process_params', function (orig) {
    return function (layer, called, req, res, done) {
      console.log('call process_params')
      patchLayer(layer)
      return orig.apply(this, arguments)
    }
  })

  shimmer.wrap(express.Router, 'get', function (orig) {
    return function (layer, called, req, res, done) {
      console.log('call process_params')
      patchLayer(layer)
      return orig.apply(this, arguments)
    }
  })


  return express
}
