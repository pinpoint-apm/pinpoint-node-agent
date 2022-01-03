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
    return function (path) {
      const result = original.apply(this, arguments)
      const fn = arguments && arguments[1]
      if (fn && fn.name !== 'router' && this.stack && this.stack.length) {
        const layer = this.stack[this.stack.length - 1]
        patchLayer(layer, 'middleware', layer.name, typeof path === 'string' && path, fn.length)
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

  function patchLayer(layer, objectName, layerName, layerPath, handlerArgumentsLength) {
    if (!layer[layerPatchedSymbol]) {
      layer[layerPatchedSymbol] = true

      const appAllbuilder = ExpressMethodDescriptorBuilder.make(makeMethodDescriptorBuilder(MODULE_NAME, indexOfRoute(objectName), indexOfHandle(objectName)), objectName, layerName, handlerArgumentsLength)
      const appAllMethodDescriptor = apiMetaService.cacheApiWithBuilder(appAllbuilder)
      shimmer.wrap(layer, 'handle', function (origin) {
        let handle
        if (origin.length !== 4) {
          handle = function (req, res, next) {
            const trace = agent.traceContext.currentTraceObject()
            if (!trace) {
              return origin.apply(this, arguments)
            }

            const spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceTypeCode.express)
            const methodDescriptor = appAllMethodDescriptor || getMethodDescriptor(objectName, layerName, req.method)
            if (methodDescriptor && layerPath) {
              spanEventRecorder.recordApiWithParameters(methodDescriptor, [layerPath])
            } else if (methodDescriptor) {
              spanEventRecorder.recordApi(methodDescriptor)
            } else {
              spanEventRecorder.recordApiDesc(getDescriptionText(objectName, layerName))
            }

            // https://github.com/elastic/apm-agent-nodejs/issues/443#issuecomment-455352070
            if (!layer.route && layerPath && typeof next === 'function') {
              let traceBlockEnded = false
              safePush(req, parameterizedLayerPathSymbol, layerPath)
              arguments[2] = function () {
                trace.traceBlockEnd(spanEventRecorder)
                traceBlockEnded = true
                if (!(req.route && arguments[0] instanceof Error)) {
                  req[parameterizedLayerPathSymbol].pop()
                }
                return next.apply(this, arguments)
              }
              const result = origin.apply(this, arguments)
              if (!traceBlockEnded) {
                trace.traceBlockEnd(spanEventRecorder)
              }
              return result
            }
            const result = origin.apply(this, arguments)
            trace.traceBlockEnd(spanEventRecorder)
            return result
          }
        } else {
          handle = function (err, req, res, next) {
            const trace = agent.traceContext.currentTraceObject()
            let spanEventRecorder = null
            if (shouldReport(err, trace)) {
              spanEventRecorder = trace.traceBlockBegin()
              spanEventRecorder.recordServiceType(ServiceTypeCode.express)
              spanEventRecorder.recordException(err, true)
              const methodDescriptor = appAllMethodDescriptor || getMethodDescriptor(objectName, layerName, req.method)
              if (methodDescriptor) {
                spanEventRecorder.recordApi(methodDescriptor)
              } else {
                spanEventRecorder.recordApiDesc(getDescriptionText(objectName, layerName, req.method))
              }
            }
            const result = origin.apply(this, arguments)
            if (trace) {
              trace.traceBlockEnd(spanEventRecorder)
            }
            return result
          }
        }

        // https://github.com/elastic/apm-agent-nodejs/issues/1067
        for (const prop in origin) {
          if (Object.prototype.hasOwnProperty.call(origin, prop)) {
            handle[prop] = origin[prop]
          }
        }

        return handle
      })
    }
  }

  function safePush(obj, prop, value) {
    if (!obj[prop]) obj[prop] = []
    obj[prop].push(value)
  }

  function shouldReport(error, trace) {
    if (!trace) {
      return false
    }
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

  function indexOfRoute(objectName) {
    if (objectName == 'route') {
      return 3
    } else {
      return 2
    }
  }

  function indexOfHandle(objectName) {
    if (objectName == 'route') {
      return 4
    } else {
      return 6
    }
  }
  return express
}
