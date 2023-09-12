/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceType = require('../../context/service-type')
const log = require('../../utils/logger')
const IdGenerator = require('../../context/id-generator')
const { addressStringOf } = require('../../utils/convert-utils')

const spanSym = Symbol('ioredis')
const asyncSym = Symbol('ioredis-async')

module.exports = function (agent, version, ioredis) {
  if (!semver.satisfies(version, '>=2.0.0 <5.0.0')) {
    log.debug('ioredis version %s not supported - aborting...', version)
    return ioredis
  }

  log.debug('shimming ioredis.Command.prototype.initPromise')
  shimmer.wrap(ioredis.Command && ioredis.Command.prototype, 'initPromise', wrapInitPromise)

  const proto = ioredis && ioredis.prototype
  shimmer.wrap(proto, 'sendCommand', wrapSendCommand)

  return ioredis

  function wrapInitPromise(original) {
    return function wrappedInitPromise() {
      const trace = agent.traceContext.currentTraceObject()

      const command = this
      const cb = this.callback

      if (typeof cb === 'function') {
        this.callback = function wrappedCallback() {
          const asyncTrace = command[asyncSym]
          const asyncEventRecorder = command[spanSym]
          if (trace && asyncTrace && asyncEventRecorder && asyncEventRecorder.ended) {
            asyncTrace.traceAsyncEnd(asyncEventRecorder)
          }
          return cb.apply(this, arguments)
        }
      }
      return original.apply(this, arguments)
    }
  }

  function wrapSendCommand (original) {
    return function wrappedSendCommand(command) {
      const trace = agent.traceContext.currentTraceObject()

      let spanEventRecorder
      let asyncTrace

      if (command && trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
        spanEventRecorder.recordApiDesc('redis.'+ String(command.name).toUpperCase()+'.call' )
        spanEventRecorder.recordDestinationId('Redis')
        if (this.connector && this.connector.options) {
          spanEventRecorder.recordEndPoint(addressStringOf(this.connector.options.host, this.connector.options.port))
        }
        trace.traceBlockEnd(spanEventRecorder)
        command[asyncSym] = asyncTrace

        asyncTrace = trace.newAsyncTrace(spanEventRecorder)
        const nextSpanId = IdGenerator.next
        const asyncEventRecorder = asyncTrace.traceAsyncBegin()
        asyncEventRecorder.recordServiceType(ServiceType.redis)
        asyncEventRecorder.recordApiDesc('redis.'+ String(command.name).toUpperCase()+'.end')
        asyncEventRecorder.recordNextSpanId(nextSpanId)
        asyncEventRecorder.recordDestinationId('Redis')
        if (this.connector && this.connector.options) {
          asyncEventRecorder.recordEndPoint(addressStringOf(this.connector.options.host, this.connector.options.port))
        }

        command[spanSym] = asyncEventRecorder

        if (command.promise) {
          const endTrace = function() {
            if (trace && asyncTrace && !asyncEventRecorder.ended) {
              asyncTrace.traceAsyncEnd(asyncEventRecorder)
            }
          }
          // Todo : This point !!?
          // if (typeof command.resolve === 'function') { // success
          // }
          // if (typeof command.reject === 'function') { // error
          // }

          if (typeof command.promise.finally === 'function') {
            // Bluebird and Node.js 10+
            command.promise.finally(endTrace)
          } else if (typeof command.promise.then === 'function') {
            command.promise.then(endTrace).catch(endTrace)
          }
        }
      }
      return original.apply(this, arguments)
    }
  }
}
