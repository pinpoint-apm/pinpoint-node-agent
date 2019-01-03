'use strict'

const shimmer = require('shimmer')
const semver = require('semver')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, koa) {
  // Test 1. emit handdle
  shimmer.wrap(koa.prototype, 'emit', function(original) {
    return function (evt, err, ctx) {
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (evt === 'error' & ctx) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
        spanEventRecorder.recordApiDesc('koa')
        spanEventRecorder.recordException(err, true)
        trace.traceBlockEnd(spanEventRecorder)
        return original.apply(this, arguments)
      }
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
        spanEventRecorder.recordApiDesc('koa')
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      return result
    }
  })
  // Test 2. middleware mount
  shimmer.wrap(koa.prototype, 'use', function(original) {
    return function wrapMiddleware(middleware) {
      return original.apply(this, arguments)
    }
  })
  // Test 3. createContext

  // Test 4.
  shimmer.wrap(koa.prototype, 'onerror', function (original) {
    return function wrapError(a, b, c) {
      return original.apply(this, arguments)
    }
  })

  // Test 5.
  // shimmer.wrap(koa.prototype, 'createContext', function(original) {
  //   return function wrapCreateContext(req, res) {
  //     const result = original.apply(this, arguments)
  //
  //     shimmer.wrap(result, 'onerror', function(ori) {
  //       return function (err) {
  //         const trace = agent.traceContext.currentTraceObject()
  //         console.log('trace')
  //         console.log(trace)
  //         if (trace) {
  //           // console.log('?!?')
  //           const spanEventRecorder = trace.traceBlockBegin()
  //           spanEventRecorder.recordServiceType(ServiceTypeCode.express)
  //           spanEventRecorder.recordApiDesc('tes')
  //           spanEventRecorder.recordException(err, true)
  //           trace.traceBlockEnd(spanEventRecorder)
  //         }
  //         return ori.apply(this, arguments)
  //       }
  //     })
  //
  //
  //
  //     return result
  //   }
  // })


  return koa
}
