'use strict'

const shimmer = require('shimmer')
const semver = require('semver')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const spanSym = Symbol('ioredis')
const asyncSym = Symbol('ioredis-async')

const IdGenerator = require('../../context/id-generator')
const AsyncIdAccessor = require('../../context/async-id-accessor')

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
          const asyncEventRecorder = command[spanSym]
          if (trace && asyncEventRecorder && asyncEventRecorder.ended) {
            trace.traceAsyncEnd(asyncEventRecorder)
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
      let asyncId

      if (command && trace) {
        if (command[asyncSym] && AsyncIdAccessor.getAsyncId(command[asyncSym])) {
          asyncId = AsyncIdAccessor.getAsyncId(command[asyncSym])
        } else {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL)
          spanEventRecorder.recordApiDesc('redis.'+ String(command.name).toUpperCase()+'.call' )
          asyncId = spanEventRecorder.recordNextAsyncId()
          trace.traceBlockEnd(spanEventRecorder)
          command[asyncSym] = asyncId
        }
        const nextSpanId = IdGenerator.next
        const asyncEventRecorder = trace.traceAsyncBegin(asyncId)
        asyncEventRecorder.recordServiceType(ServiceTypeCode.redis)
        asyncEventRecorder.recordApiDesc('redis.'+ String(command.name).toUpperCase()+'.end')
        asyncEventRecorder.recordNextSpanId(nextSpanId)

        command[spanSym] = asyncEventRecorder

        if (command.promise) {
          const endTrace = function() {
            if (trace && !asyncEventRecorder.ended) {
              trace.traceAsyncEnd(asyncEventRecorder)
            }
          }
          // Todo : This point !!?
          // if (typeof command.resolve === 'function') { // success
          //   console.log(`resolve\n`,command.resolve)
          // }
          // if (typeof command.reject === 'function') { // error
          //   console.log(`reject\n`,command.reject)
          // }

          // console.log('command.promise.\n', command.promise)

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
