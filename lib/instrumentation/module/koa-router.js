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
const layerPatchedSymbol = Symbol('PinpointKoaLayerPatched')
const { makeMethodDescriptorBuilder } = require('../../context/make-method-descriptor-builder')
const KoaMethodDescriptorBuilder = require('../../context/koa-method-descriptor-builder')
const apiMetaService = require('../../context/api-meta-service')

module.exports = function (agent, version, router) {
  if (!semver.satisfies(version, '>=5.2.0 <8')) {
    log.debug('koa-router version %s not supported - aborting...', version)
    return router
  }

  shimmer.wrap(router.prototype, 'register', function (original) {
    return function (path, methods, middleware, opts) {
      const layer = original.apply(this, arguments)

      if (layer[layerPatchedSymbol]) {
        return layer
      }

      layer[layerPatchedSymbol] = true

      if (!Array.isArray(layer.stack) || layer.stack.length < 1) {
        return layer
      }

      const handlerIndex = layer.stack.length - 1
      const fn = layer.stack[handlerIndex]
      if (typeof fn !== 'function') {
        return layer
      }

      const builder = KoaMethodDescriptorBuilder.make(makeMethodDescriptorBuilder('koa', 2, 3))
      const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
      layer.stack[handlerIndex] = async function (ctx, next) {
        const name = fn.name || 'AnonymousFunction'
        const trace = agent.traceContext.currentTraceObject()
        let spanEventRecorder = null
        let result
        try {
          if (trace) {
            spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
            recordAPI(methodDescriptor, path, spanEventRecorder, ctx, name)
          }
          result = await fn.apply(this, arguments)
        } catch (e) {
          if (!e._pinpointCheck) {
            e._pinpointCheck = true
            spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
            recordAPI(methodDescriptor, path, spanEventRecorder, ctx, name)
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
      return layer
    }
  })

  shimmer.wrap(router.prototype, 'match', function (original) {
    return function (_, method) {
      var matched = original.apply(this, arguments)
      if (typeof method !== 'string') {
        log.debug('unexpected method type in koa-router prototype.match: %s', typeof method)
        return matched
      }
      return matched
    }
  })

  return router
}

function recordAPI(methodDescriptor, path, spanEventRecorder, ctx, name) {
  if (methodDescriptor && typeof path === 'string') {
    spanEventRecorder.recordApiWithParameters(methodDescriptor, [path])
  } else if (methodDescriptor) {
    spanEventRecorder.recordApi(methodDescriptor)
  } else {
    spanEventRecorder.recordApiDesc(`koa.router.${ctx.method.toLocaleLowerCase()} [${name}]`)
  }
}

