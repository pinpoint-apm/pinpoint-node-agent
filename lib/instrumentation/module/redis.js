/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const shimmer = require('@pinpoint-apm/shimmer')
const ServiceType = require('../../context/service-type')
const log = require('../../utils/logger')
const IdGenerator = require('../../context/id-generator')
const { addressStringOf } = require('../../utils/convert-utils')
const TraceBuilder = require('../context/trace-builder')
const InstrumentMethod = require('../instrument-method')
const RedisInternalSendCommandInterceptor = require('./redis/redis-internal-send-command-interceptor')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '>2.5.3')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const proto = redis.RedisClient && redis.RedisClient.prototype
  log.debug('shimming redis.RedisClient.prototype.internal_send_command')
  // shimmer.wrap(proto, 'internal_send_command', wrapInternalSendCommand)
  InstrumentMethod.make(proto, 'internal_send_command').addScopedInterceptor(new RedisInternalSendCommandInterceptor())

  return redis

  function makeWrappedCallback (cb, command, asyncTrace, asyncEventRecorder) {
    return agent.spanEndCallbackWrapper(asyncTrace, asyncEventRecorder, function wrappedCallback () {
      log.debug(`wrappedCallback command: ${command}`)

      if (cb) {
        const result = cb.apply(this, arguments)
        if (asyncTrace) {
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
          asyncTrace.close()
        }
        return result
      }
    })
  }

  // >2.5.3
  function wrapInternalSendCommand (original) {
    return function wrappedInternalSendCommand (commandObj) {
      const trace = agent.traceContext.currentTraceObject()
      const isPinpointCallbackWrapper = commandObj &&
        typeof commandObj.callback === 'function' &&
        commandObj.callback.name === "pinpointCallbackWrapper"
      if (!isPinpointCallbackWrapper && trace) {
        const command = commandObj && commandObj.command
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceType.redis)
        spanEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.call')
        spanEventRecorder.recordDestinationId('Redis')
        if (this.connection_options) {
          spanEventRecorder.recordEndPoint(addressStringOf(this.connection_options.host, this.connection_options.port))
        }
        spanEventRecorder.recordNextAsyncId()
        trace.traceBlockEnd(spanEventRecorder)
        
        const asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(spanEventRecorder.getLocalAsyncId())
        const nextSpanId = IdGenerator.next
        const asyncEventRecorder = asyncTrace.traceAsyncBegin()
        asyncEventRecorder.recordServiceType(ServiceType.redis)
        asyncEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.end')
        asyncEventRecorder.recordNextSpanId(nextSpanId)
        asyncEventRecorder.recordDestinationId('Redis')
        if (this.connection_options) {
          asyncEventRecorder.recordEndPoint(addressStringOf(this.connection_options.host, this.connection_options.port))
        }

        commandObj.callback = makeWrappedCallback(commandObj.callback, command, asyncTrace, asyncEventRecorder)
      }

      return original.apply(this, arguments)
    }
  }
}

