'use strict'

const shimmer = require('shimmer')

const log = require('../../utils/logger')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

const patchedLayerSet = new Set()

module.exports = function(agent, version, express) {

  // shimmer.wrap(express.application, 'use', function (original) {
  //   return function () {
  //     log.info('>> [Express] express.application.use ', this.stack)
  //     return original.apply(this, arguments)
  //   }
  // })

  shimmer.wrap(express.Router, 'use', function (original) {
    return function () {
      const result = original.apply(this, arguments)
      const fn = arguments && arguments[1]
      if (fn && fn.name !== 'router' && this.stack && this.stack.length) {
        log.debug('>> [Express] express.Router.use ', this.stack[this.stack.length - 1])
        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'middleware')
      }
      return result
    }
  })

  shimmer.wrap(express.Router, 'route', function (original) {
    return function () {
      const result = original.apply(this, arguments)
      if (this.stack && this.stack.length) {
        log.debug('>> [Express] express.Router.route ', this.stack[this.stack.length - 1])
        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'route')
      }
      return result
    }
  })

  function doPatchLayer(layer, moduleName) {
    shimmer.wrap(layer, 'handle', function(original) {
      return (original.length === 4)
        ? recordErrorHandle(original, moduleName)
        : recordHandle(original, moduleName)
    })
  }

  function recordHandle (original, moduleName) {
    return function (req, res, next) {
      log.info('recordHandle start', getApiDesc(moduleName, req))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApiDesc(getApiDesc(moduleName, req))
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.info('recordHandle end', getApiDesc(moduleName, req))
      return result
    }
  }

  function recordErrorHandle (original, moduleName) {
    return function (err, req, res, next) {
      log.info('recordErrorHandle start', getApiDesc(moduleName, req))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null

      if (err && trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApiDesc(getApiDesc(moduleName, req))
        spanEventRecorder.recordException(err, true)
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.info('recordErrorHandle end', getApiDesc(moduleName, req))
      return result
    }
  }

  function getApiDesc (moduleName, req) {
    const apiDesc = ['express', moduleName]
    if (moduleName === 'route' && req.method) {
      apiDesc.push(req.method.toLowerCase())
    }
    return apiDesc.join('.')
  }

  return express
}
