'use strict'

const shimmer = require('shimmer')
const semver = require('semver')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')

module.exports = function (agent, version, ioredis) {
  if (!semver.satisfies(version, '>=2.0.0 <5.0.0')) {
    log.debug('ioredis version %s not supported - aborting...', version)
    return ioredis
  }


  const proto = ioredis && ioredis.prototype
  shimmer.wrap(proto, 'sendCommand', wrapSendCommand)

  return ioredis

  function makeWrappedCallback (cb, trace, spanEventRecorder) {
    if (trace) {
      trace.traceBlockEnd(spanEventRecorder)
    }
    if (cb) {
      return cb.apply(this, arguments)
    }
  }

  function wrapSendCommand (original) {
    return function wrappedSendCommand(commandObj) {
      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder
      if (commandObj && trace) {
        const command = commandObj && commandObj.name
        if (command !== 'info' || command !== 'expire') {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.redis)
          spanEventRecorder.recordApiDesc('cache.redis::'+ String(command).toUpperCase())
          commandObj.callback = makeWrappedCallback(commandObj.callback, trace, spanEventRecorder)
        }
      }
      return original.apply(this, arguments)
    }
  }
}
