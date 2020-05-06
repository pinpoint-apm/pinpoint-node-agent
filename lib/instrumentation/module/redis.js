'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const IdGenerator = require('../../context/id-generator')

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
      if (asyncTrace) asyncTrace.traceAsyncEnd(asyncEventRecorder)
      if (cb) {
        return cb.apply(this, arguments)
      }  
    })
  }

  // >2.5.3
  function wrapInternalSendCommand (original) {
    return function wrappedInternalSendCommand (commandObj) {
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder
      if (commandObj && commandObj.callback.name != "pinpointCallbackWrapper" && trace) {
        const command = commandObj && commandObj.command
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.redis)
        spanEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.call')
        spanEventRecorder.recordDestinationId('Redis')
        trace.traceBlockEnd(spanEventRecorder)

        const asyncTrace = trace.newAsyncTrace(spanEventRecorder)
        const nextSpanId = IdGenerator.next
        const asyncEventRecorder = asyncTrace.traceAsyncBegin()
        asyncEventRecorder.recordServiceType(ServiceTypeCode.redis)
        log.debug(`wrappedInternalSendCommand command: ${command}`)
        asyncEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase() + '.end')
        asyncEventRecorder.recordNextSpanId(nextSpanId)
        asyncEventRecorder.recordDestinationId('Redis')

        commandObj.callback = makeWrappedCallback(commandObj.callback, command, asyncTrace, asyncEventRecorder)
      }

      return original.apply(this, arguments)
    }
  }
}

