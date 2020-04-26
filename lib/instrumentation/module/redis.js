'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '>2.5.3')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const proto = redis.RedisClient && redis.RedisClient.prototype
  log.debug('shimming redis.RedisClient.prototype.internal_send_command')
  shimmer.wrap(proto, 'internal_send_command', wrapInternalSendCommand)

  return redis

  function makeWrappedCallback (cb, command, trace, spanEventRecorder) {
    return agent.spanEndCallbackWrapper(trace, spanEventRecorder, function wrappedCallback () {
      log.debug(`wrappedCallback command: ${command}`)
      if (trace) trace.traceBlockEnd(spanEventRecorder)
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
      if (commandObj && trace) {
        const command = commandObj && commandObj.command
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.redis)
        spanEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase())
        commandObj.callback = makeWrappedCallback(commandObj.callback, command, trace, spanEventRecorder)
      }

      return original.apply(this, arguments)
    }
  }
}

