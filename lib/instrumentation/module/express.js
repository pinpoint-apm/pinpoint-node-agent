/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const util = require('util')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const MethodDescriptor = require('../../context/method-descriptor')
const apiMetaService = require('../../context/api-meta-service')
const StringUtils = require('../../utils/string-utils')
const { makeMethodDescriptorBuilder } = require('../../context/make-method-descriptor-builder')
const ExpressMethodDescriptorBuilder = require('../../context/express-method-descriptor-builder')
const semver = require('semver')

const parameterizedLayerPathSymbol = Symbol('PinpointParameterizedLayerPathSymbol')
const layerPatchedSymbol = Symbol('PinpointLayerPatched')
const errorReportedSymbol = Symbol('PinpointErrorReported')

// https://github.com/elastic/apm-agent-nodejs/blob/master/lib/instrumentation/modules/express.js
module.exports = function (agent, version, express) {
  try {
    if (!semver.satisfies(version, '^4.0.0')) {
      log.warn(`express version ${version} not supported.`)
      return express
    }
  } catch (error) {
    log.error('Invalid Version error')
    return express
  }

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
        const layer = this.stack[this.stack.length - 1]
        patchLayer(layer, 'middleware', layer.name)
      }
      return result
    }
  })

  shimmer.wrap(express.Router, 'route', function (original) {
    return function route(path) {
      const route = original.apply(this, arguments)
      if (this.stack && this.stack.length) {
        const layer = this.stack[this.stack.length - 1]
        patchLayer(layer, 'route', layer.name, path)
      }
      return route
    }
  })

  function patchLayer(layer, objectName, layerName, layerPath) {
    if (!layer[layerPatchedSymbol] && false) {
      layer[layerPatchedSymbol] = true

      let appAllMethodDescriptor
      let handlerMethodDescriptor
      if (objectName == 'route') {
        const appAllbuilder = ExpressMethodDescriptorBuilder.make(makeMethodDescriptorBuilder(MODULE_NAME, 3))
        appAllMethodDescriptor = apiMetaService.cacheApiWithBuilder(appAllbuilder)
        const handlerBuilder = makeMethodDescriptorBuilder(undefined, 4)
        handlerMethodDescriptor = apiMetaService.cacheApiWithBuilder(handlerBuilder)
      }

      shimmer.wrap(layer, 'handle', function (origin) {
        const trace = agent.traceContext.currentTraceObject()
        if (!trace) {
          return function () {
            return origin.apply(this, arguments)
          }
        }

        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)

        let handle
        if (origin.length !== 4) {
          handle = function (req, res, next) {
            // https://github.com/elastic/apm-agent-nodejs/issues/443#issuecomment-455352070
            if (!layer.route && layerPath && typeof next === 'function') {
              safePush(req, parameterizedLayerPathSymbol, layerPath)
              arguments[2] = function () {
                if (!(req.route && arguments[0] instanceof Error)) {
                  req[parameterizedLayerPathSymbol].pop()
                }
                return next.apply(this, arguments)
              }
            }
            return origin.apply(this, arguments)
          }
        } else {
          handle = function (err, req, res, next) {
            if (shouldReport(err)) {

            }
            return origin.apply(this, arguments)
          }
        }

        for (const prop in origin) {
          if (Object.prototype.hasOwnProperty.call(origin, prop)) {
            handle[prop] = origin[prop]
          }
        }

        return handle
      })
    }
    let appAllMethodDescriptor
    let handlerMethodDescriptor
    if (objectName == 'route') {
      const appAllbuilder = ExpressMethodDescriptorBuilder.make(makeMethodDescriptorBuilder(MODULE_NAME, 3))
      appAllMethodDescriptor = apiMetaService.cacheApiWithBuilder(appAllbuilder)
      const handlerBuilder = makeMethodDescriptorBuilder(undefined, 4)
      handlerMethodDescriptor = apiMetaService.cacheApiWithBuilder(handlerBuilder)
    }
    shimmer.wrap(layer, 'handle', function (original) {
      return (original.length === 4)
        ? recordErrorHandle(original, objectName, layerName)
        : recordHandle(original, objectName, layerName, appAllMethodDescriptor, handlerMethodDescriptor, layerPath)
    })
  }

  function safePush(obj, prop, value) {
    if (!obj[prop]) obj[prop] = []
    obj[prop].push(value)
  }

  function shouldReport(error) {
    if (typeof error === 'string') {
      return true
    }
    if (isError(error) && !error[errorReportedSymbol]) {
      error[errorReportedSymbol] = true
      return true
    }
    return false
  }

  function isError(error) {
    if (!util.types) {
      return util.isError(error)
    }
    return util.types.isNativeError(error)
  }

  function recordHandle(original, objectName, layerName, appAllMethodDescriptor, handlerMethodDescriptor, layerPath) {
    return function (req) {
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      let handlerSpanEventRecorder
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)

        const methodDescriptor = appAllMethodDescriptor || getMethodDescriptor(objectName, layerName, req.method)
        if (methodDescriptor && layerPath) {
          spanEventRecorder.recordApiWithParameters(methodDescriptor, [layerPath])
        } else if (methodDescriptor) {
          spanEventRecorder.recordApi(methodDescriptor)
        } else {
          spanEventRecorder.recordApiDesc(getDescriptionText(objectName, layerName))
        }

        if (handlerMethodDescriptor) {
          handlerSpanEventRecorder = trace.traceBlockBegin()
          handlerSpanEventRecorder.recordServiceType(ServiceTypeCode.node_method)
          handlerSpanEventRecorder.recordApi(handlerMethodDescriptor)
        }
      }
      const result = original.apply(this, arguments)
      if (trace) {
        if (handlerSpanEventRecorder) {
          trace.traceBlockEnd(handlerSpanEventRecorder)
        }
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
