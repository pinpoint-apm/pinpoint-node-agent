'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const log = require('utils/logger')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, router) {
  // if (!semver.satisfies(version, '>=5.2.0 <8')) {
  //   log.debug('koa-router version %s not supported - aborting...', version)
  //   return Router
  // // }
  //
  shimmer.wrap(router.prototype, 'register', function(original) {
    return function (path, methods, middleware, opts) {
      const layer = original.apply(this, arguments)
      if (layer.stack) {
        layer.stack.forEach((fn, index) => {
          if (typeof fn === 'function') {
            let result
            layer.stack[index] = async function(req, next) {
              const trace = agent.traceContext.currentTraceObject()
              let spanEventRecorder = null
              try {
                if (trace) {
                  spanEventRecorder = trace.traceBlockBegin()
                  spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                  spanEventRecorder.recordApiDesc(`koa.router.${req.method.toLocaleLowerCase()}`)
                }
                result = await fn.apply(this, arguments)
              } catch (e) {
                spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                spanEventRecorder.recordApiDesc(`koa.router.${req.method.toLocaleLowerCase()}`)
                spanEventRecorder.recordException(e, true)
                throw e
              } finally {
                if (trace) {
                  trace.traceBlockEnd(spanEventRecorder)
                }
              }
              return result
            }
          }
        })
      }
      return layer
    }
  })

  return router
}
