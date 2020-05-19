'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const IdGenerator = require('../../context/id-generator')
const { addressStringOf } = require('../../utils/convert-utils')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '>2.5.3')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const proto = redis.RedisClient && redis.RedisClient.prototype
  log.debug('shimming redis.RedisClient.prototype.internal_send_command')
  shimmer.wrap(proto, 'internal_send_command', wrapInternalSendCommand)

  return redis

  function makeWrappedCallback (cb, command, asyncTrace, asyncEventRecorder) {
    return agent.spanEndCallbackWrapper(asyncTrace, asyncEventRecorder, function wrappedCallback () {
      log.debug(`wrappedCallback command: ${command}`)

      if (cb) {
        const result = cb.apply(this, arguments)
        if (asyncTrace) asyncTrace.traceAsyncEnd(asyncEventRecorder)
        return result
      }
    })
  }

  // >2.5.3
  function wrapInternalSendCommand (original) {
    return function wrappedInternalSendCommand (commandObj) {
      const trace = agent.traceContext.currentTraceObject()
      let result
      if (commandObj && commandObj.callback.name != "pinpointCallbackWrapper" && trace) {
        const command = commandObj && commandObj.command
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.redis)
        spanEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.call')
        spanEventRecorder.recordDestinationId('Redis')
        if (this.connection_options) {
          spanEventRecorder.recordEndPoint(addressStringOf(this.connection_options.host, this.connection_options.port))
        }
        
        const asyncTrace = trace.newAsyncTrace(spanEventRecorder)
        const nextSpanId = IdGenerator.next
        const asyncEventRecorder = asyncTrace.traceAsyncBegin()
        asyncEventRecorder.recordServiceType(ServiceTypeCode.redis)
        asyncEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.end')
        asyncEventRecorder.recordNextSpanId(nextSpanId)
        asyncEventRecorder.recordDestinationId('Redis')
        if (this.connection_options) {
          asyncEventRecorder.recordEndPoint(addressStringOf(this.connection_options.host, this.connection_options.port))
        }

        commandObj.callback = makeWrappedCallback(commandObj.callback, command, asyncTrace, asyncEventRecorder)
        result = original.apply(this, arguments)
        trace.traceBlockEnd(spanEventRecorder)
      } else {
        result = original.apply(this, arguments)
      }

      return result
    }
  }
}

