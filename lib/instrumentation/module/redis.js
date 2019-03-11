'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')

module.exports = function (agent, version, redis) {
  if (!semver.satisfies(version, '^2.0.0')) {
    log.debug('redis version %s not supported - aborting...', version)
    return redis
  }

  const proto = redis.RedisClient && redis.RedisClient.prototype
  if (semver.satisfies(version, '>2.5.3')) {
    log.debug('shimming redis.RedisClient.prototype.internal_send_command')
    shimmer.wrap(proto, 'internal_send_command', wrapInternalSendCommand)
  } else {
    log.debug('shimming redis.RedisClient.prototype.send_command')
    shimmer.wrap(proto, 'send_command', wrapSendCommand)
  }

  return redis

  function makeWrappedCallback (cb, trace, spanEventRecorder) {
    if (trace) trace.traceBlockEnd(spanEventRecorder)
    if (cb) {
      return cb.apply(this, arguments)
    }
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
        commandObj.callback = makeWrappedCallback(commandObj.callback, trace, spanEventRecorder)
      }

      return original.apply(this, arguments)
    }
  }

  function wrapSendCommand (original) {
    return function wrappedSendCommand (command) {
      const args = Array.prototype.slice.call(arguments)

      if (args.length > 0) {

        const trace = agent.traceContext.currentTraceObject()
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.redis)
        spanEventRecorder.recordApiDesc('redis.'+ String(command).toLowerCase())

        const index = args.length - 1
        const cb = args[index]

        if (typeof cb === 'function') {
          args[index] = makeWrappedCallback(cb, trace, spanEventRecorder)
        } else if (Array.isArray(cb) && typeof cb[cb.length - 1] === 'function') {
          cb[cb.length - 1] = makeWrappedCallback(cb[cb.length - 1], trace, spanEventRecorder)
        } else {
          const obCb = makeWrappedCallback(null, trace, spanEventRecorder)
          if (typeof args[index] === 'undefined') {
            args[index] = obCb
          } else {
            args.push(obCb)
          }
        }
      }
      return original.apply(this, args)
    }
  }
}

