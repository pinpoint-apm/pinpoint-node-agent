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

  function getMethodDescriptor(objectPath, methodName, httpMethod, callstack) {
    const stacks = callstack.stack.split(/\n */)
    const expressMethodDescriptor = makeHttpMethodMethodDescriptor(stacks)
    const method = objectPath === 'route' ? httpMethod : methodName
    return methodDescriptorMap[objectPath + method]
  }

  function getDescriptionText(objectPath, methodName, httpMethod) {
    return MODULE_NAME + '.' + objectPath + '.' + (methodName ? StringUtils.encodeMethodName(methodName) : 'AnonymousFunction')
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
        // log.debug('>> [Express] express.Router.use ', this.stack[this.stack.length - 1])
        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'middleware', layer.name)
      }
      return result
    }
  })

  shimmer.wrap(express.Router, 'route', function (original) {
    return function () {
      const result = original.apply(this, arguments)
      if (this.stack && this.stack.length) {
        const callstack = {}
        Error.captureStackTrace(callstack)

        const layer = this.stack[this.stack.length - 1]
        doPatchLayer(layer, 'route', layer.name, callstack)
      }
      return result
    }
  })

  function doPatchLayer(layer, moduleName, methodName, callstack) {
    shimmer.wrap(layer, 'handle', function (original) {
      return (original.length === 4)
        ? recordErrorHandle(original, moduleName, methodName)
        : recordHandle(original, moduleName, methodName, callstack)
    })
  }

  function recordHandle(original, moduleName, methodName, callstack) {
    return function (req, res, next) {
      // log.debug('recordHandle start', getMethodDescriptor(moduleName, methodName, req.method))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)

        const methodDescriptor = getMethodDescriptor(moduleName, methodName, req.method, callstack)
        if (methodDescriptor) {
          spanEventRecorder.recordApi(getMethodDescriptor(moduleName, methodName, req.method, callstack))
        } else {
          spanEventRecorder.recordApiDesc(getDescriptionText(moduleName, methodName, req.method))
        }
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      // log.debug('recordHandle end', getMethodDescriptor(moduleName, methodName, req.method))
      return result
    }
  }

  function recordErrorHandle(original, moduleName, methodName) {
    return function (err, req, res, next) {
      log.debug('recordErrorHandle start', getMethodDescriptor(moduleName, methodName, req.method))
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null

      if (err && trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.express)
        spanEventRecorder.recordException(err, true)
        const methodDescriptor = getMethodDescriptor(moduleName, methodName, req.method)
        if (methodDescriptor) {
          spanEventRecorder.recordApi(getMethodDescriptor(moduleName, methodName, req.method))
        } else {
          spanEventRecorder.recordApiDesc(getDescriptionText(moduleName, methodName, req.method))
        }
      }
      const result = original.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('recordErrorHandle end', getMethodDescriptor(moduleName, methodName, req.method))
      return result
    }
  }

  function resolveApiName(moduleName, httpMethod) {
    if (moduleName === 'route') {
      return moduleName + httpMethod
    }
    return moduleName
  }

  return express
}

function makeHttpMethodMethodDescriptor(stacks) {
  if (!stacks || stacks.length < 4) {
    return
  }
  const httpMethod = stacks[2]
  const groups = httpMethod.match(/(?:Function\.(?<functionName>\w+)\..+)?(?:\s\[as\s(?<method>\w+)\])?\s\(.+\/(?<fileName>[^/]+):(?<lineNumber>[0-9]+):(?<columnNumber>[0-9]+)\)$/)
  return new MethodDescriptor()
}

