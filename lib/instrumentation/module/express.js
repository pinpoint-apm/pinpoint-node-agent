'use strict'

const shimmer = require('shimmer')

const log = require('../../utils/logger')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const MethodDescriptor = require('../../context/method-descriptor')
const apiMetaService = require('../../context/api-meta-service')

const patchedLayerSet = new Set()

module.exports = function(agent, version, express) {

  const MODULE_NAME = 'express'
  const OBJECT_NAME = 'route'
  const methodNames = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'PATCH', 'ALL']
  const methodDescriptorMap = methodNames.reduce((map, methodName) => {
    const descriptor = MethodDescriptor.create(MODULE_NAME, OBJECT_NAME, methodName)
    apiMetaService.cacheApi(descriptor)
    map[OBJECT_NAME + methodName] = descriptor
    return map
  }, {})

  function getMethodDescriptor (objectPath, methodName) {
    return methodDescriptorMap[objectPath + methodName] ||
        MethodDescriptor.create(MODULE_NAME, OBJECT_NAME, methodName)
  }

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
      log.debug('recordHandle start', getMethodDescriptor(moduleName, req.method))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApi(getMethodDescriptor(moduleName, req.method))
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('recordHandle end', getMethodDescriptor(moduleName, req.method))
      return result
    }
  }

  function recordErrorHandle (original, moduleName) {
    return function (err, req, res, next) {
      log.debug('recordErrorHandle start', getMethodDescriptor(moduleName, req.method))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null

      if (err && trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordApi(getMethodDescriptor(moduleName, req.method))
        spanEventRecorder.recordException(err, true)
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('recordErrorHandle end', getMethodDescriptor(moduleName, req.method))
      return result
    }
  }

  return express
}
