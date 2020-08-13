/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const MethodDescriptor = require('../../context/method-descriptor')
const apiMetaService = require('../../context/api-meta-service')

module.exports = function(agent, version, router) {
  if (!semver.satisfies(version, '>=5.2.0 <8')) {
    log.debug('koa-router version %s not supported - aborting...', version)
    return router
  }

  const methodDescriptorMap = new Map()

  const MODULE_NAME = 'koa'
  const OBJECT_NAME = 'router'

  function getMethodDescriptor (methodName) {
    return methodDescriptorMap.get(methodName)|| setMethodDescriptor(methodName)
  }

  function setMethodDescriptor(methodName) {
    const descriptor = MethodDescriptor.create(MODULE_NAME, OBJECT_NAME, methodName)
    apiMetaService.cacheApi(descriptor)
    methodDescriptorMap.set(methodName, descriptor)
    return descriptor
  }

    shimmer.wrap(router.prototype, 'register', function(original) {
    return function (path, methods, middleware, opts) {
      const layer = original.apply(this, arguments)
      if (layer.stack) {
        layer.stack.forEach((fn, index) => {
          if (typeof fn === 'function') {
            let result
            layer.stack[index] = async function(ctx, next) {
              const name = fn.name || 'AnonymousFunction'
              const trace = agent.traceContext.currentTraceObject()
              let spanEventRecorder = null
              try {
                if (trace) {
                  spanEventRecorder = trace.traceBlockBegin()
                  spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                  spanEventRecorder.recordApiDesc(`koa.router.${ctx.method.toLocaleLowerCase()} [${name}]`)
                }
                result = await fn.apply(this, arguments)
              } catch (e) {
                if (!e._pinpointCheck) {
                  e._pinpointCheck = true
                  spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                  spanEventRecorder.recordApiDesc(`koa.router.${ctx.method.toLocaleLowerCase()} [${name}]`)
                  spanEventRecorder.recordException(e, true)
                }
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
