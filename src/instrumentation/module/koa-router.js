'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const log = require('utils/logger')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, router) {
  // if (!semver.satisfies(version, '>=5.2.0 <8')) {
  //   log.debug('koa-router version %s not supported - aborting...', version)
  //   return Router
  // }

  shimmer.wrap(router.prototype, 'match', function(original) {
    return function (_, method) {
      const result = original.apply(this, arguments)

      if (typeof method !== 'string') {
        log.debug('unexpected method type in koa-router prototype.match: %s', typeof method)
        return result
      }
      if (Array.isArray(result && result.pathAndMethod)) {
        const layer = result.pathAndMethod.find(function (layer) {
          return layer && layer.opts && layer.opts.end === true
        })
        const path = layer && layer.path
        if (typeof path === 'string') {
          const name = method + ' ' + path  // todo . agument

          const trace = agent.traceContext.currentTraceObject()
          let spanEventRecorder = null
          if (trace) {
            spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
            spanEventRecorder.recordApiDesc(`koa.router.${method.toLocaleLowerCase()}`)
          }
          if (trace) {
            trace.traceBlockEnd(spanEventRecorder)
          }
        } else {
          log.debug('unexpected path type in koa-router prototype.match: %s', typeof path)
        }
      } else {
        log.debug('unexpected match result in koa-router prototype.match: %s', typeof result)
      }
      return result
    }
  })

  return router
}
