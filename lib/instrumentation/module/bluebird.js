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

const BLUEBIRD_FNS = ['_then', '_addCallbacks']

module.exports = function (agent, version, bluebird) {
  if (!semver.satisfies(version, '>=2 <4')) {
    log.debug('bluebird version %s not supported - aborting...', version)
    return bluebird
  }
  //TODO. Additional development is required. (일단 그냥 해보고 문제가 되면 바꾸자..)[0]

  log.debug('shimming bluebird.prototype functions:', BLUEBIRD_FNS)
  shimmer.massWrap(bluebird.prototype, BLUEBIRD_FNS, wrapThen)


  // bluebird.prototype._attachCancellationCallback function with a new
  // function. We need to hook into this new function
  log.debug('shimming bluebird.config')
  shimmer.wrap(bluebird, 'config', function wrapConfig(original) {
    return function wrappedConfig() {
      const result = original.apply(this, arguments)
      log.debug('shimming bluebird.prototype._attachCancellationCallback')
      shimmer.wrap(bluebird.prototype, '_attachCancellationCallback', function wrapAttachCancellationCallback (original) {
        return function wrappedAttachCancellationCallback(onCancel) {
          if (arguments.length !== 1) return original.apply(this, arguments)
          return original.call(this, bindEventRecord(onCancel))  // Todo. bindfunction 대신.
        }
      })
      return result
    }
  })

  if (semver.satisfies(version, '<3')) {
    log.debug('shimming bluebird.each')
    shimmer.wrap(bluebird, 'each', function wrapEach(original) {
      return function wrappedEach (promises, fn) {
        if (arguments.length !== 2) return original.apply(this, arguments)
        return original.call(this, promises, bindEventRecord(fn)) // Todo. bindfunction 대신.
      }
    })

    log.debug('shimming bluebird.prototype.each')
    shimmer.wrap(bluebird.prototype, 'each', function wrapEach(original) {
      return function wrappedEach (fn) {
        if (arguments.length !== 1) return original.apply(this, arguments)
        return original.call(this, bindEventRecord(fn)) // Todo. bindfunction 대신.
      }
    })
  }

  return bluebird

  function wrapThen(original) {
    return function wrappedThen() {
      const args = Array.prototype.slice.call(arguments)
      if (typeof args[0] === typeof 'function') args[0] = bindEventRecord(args[0])
      if (typeof args[1] === typeof 'function') args[1] = bindEventRecord(args[1])
      return original.apply(this, args)
    }
  }

  // todo. error 처리 어떻게 할 것인지?~
  function bindEventRecord(original) {
    const trace = agent.traceContext.currentTraceObject()
    let spanEventRecorder = null
    if (trace) {
      spanEventRecorder = trace.traceBlockBegin()
      spanEventRecorder.recordServiceType(ServiceTypeCode.bluebird)
      spanEventRecorder.recordApiDesc(`bluebird`)
    }
    const result = original.apply(this, arguments)
    if (trace) {
      trace.traceBlockEnd(spanEventRecorder)
    }
    return result
  }
}


