/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const MethodDescriptor = require('../../context/method-descriptor')
const apiMetaService = require('../../context/api-meta-service')
const StringUtils = require('../../utils/string-utils')
const { makeMethodDescriptorBuilder } = require('../../context/make-method-descriptor-builder')

module.exports = function (agent, version, express) {

  const MODULE_NAME = 'express'
  const methodNames = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'PATCH', 'ALL']

  const names = methodNames.map(method => ['route', method])
  const methodDescriptorMap = names.reduce((descMap, [objectName, methodName]) => {
    const descriptor = MethodDescriptor.create(MODULE_NAME, objectName, methodName)
    apiMetaService.cacheApi(descriptor)
    descMap[objectName + methodName] = descriptor
    return descMap
  }, {})

  function getMethodDescriptor(objectPath, methodName, httpMethod) {
    const method = objectPath === 'route' ? httpMethod : methodName
    return methodDescriptorMap[objectPath + method]
  }

  function getDescriptionText(objectPath, methodName) {
    return MODULE_NAME + '.' + objectPath + '.' + (methodName ? StringUtils.encodeMethodName(methodName) : 'AnonymousFunction')
  }

  shimmer.wrap(express.Router, 'use', function (original) {
    return function () {
      const result = original.apply(this, arguments)
      const fn = arguments && arguments[1]
      if (fn && fn.name !== 'router' && this.stack && this.stack.length) {
        // log.debug('>> [Express] express.Router.use ', this.stack[this.stack.length - 1])
        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'middleware', layer.name)
      }
      return result
    }
  })

  shimmer.wrap(express.Router, 'route', function (original) {
    const handlerBuilder = makeMethodDescriptorBuilder(MODULE_NAME, 3)
    const callerBuilder = makeMethodDescriptorBuilder(MODULE_NAME, 4)
    return function () {
      const result = original.apply(this, arguments)
      if (this.stack && this.stack.length) {
        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'route', layer.name, handlerBuilder, callerBuilder)
      }
      return result
    }
  })

  function doPatchLayer(layer, objectName, layerName, handlerBuilder, callerBuilder) {
    shimmer.wrap(layer, 'handle', function (original) {
      return (original.length === 4)
        ? recordErrorHandle(original, objectName, layerName)
        : recordHandle(original, objectName, layerName, handlerBuilder, callerBuilder)
    })
  }

  function recordHandle(original, objectName, layerName, handlerBuilder, callerBuilder) {
    return function (req, res, next) {
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)

        const methodDescriptor = getMethodDescriptor(objectName, layerName, req.method)
        if (methodDescriptor) {
          spanEventRecorder.recordApi(getMethodDescriptor(objectName, layerName, req.method))
        } else {
          spanEventRecorder.recordApiDesc(getDescriptionText(objectName, layerName, req.method))
        }
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      return result
    }
  }

  function recordErrorHandle(original, objectName, layerName) {
    return function (err, req, res, next) {
      log.debug('recordErrorHandle start', getMethodDescriptor(objectName, layerName, req.method))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null

      if (err && trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordException(err, true)
        const methodDescriptor = getMethodDescriptor(objectName, layerName, req.method)
        if (methodDescriptor) {
          spanEventRecorder.recordApi(getMethodDescriptor(objectName, layerName, req.method))
        } else {
          spanEventRecorder.recordApiDesc(getDescriptionText(objectName, layerName, req.method))
        }
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('recordErrorHandle end', getMethodDescriptor(objectName, layerName, req.method))
      return result
    }
  }
  return express
}
