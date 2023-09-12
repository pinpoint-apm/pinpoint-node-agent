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
const ValueType = require('../../constant/valued-type').ValuedType
const convertUtils = require('../../utils/convert-utils')
const IdGenerator = require('../../context/id-generator')
const mongoJSONData = require('./mongodb/mongo-json-data-annotation-key')

const SERVER_FNS = ['insert', 'update', 'remove', 'auth']
const CURSOR_FNS_FIRST = ['next', '_getmore']

const firstTrace = Symbol('first-trace')

// https://github.com/elastic/apm-agent-nodejs/blob/master/lib/instrumentation/modules/mongodb-core.js
module.exports = function(agent, version, mongodb) {
  if (!semver.satisfies(version, '>=1.0.0')) {
    return mongodb
  }

  if (mongodb.Server) {
    log.debug('shimming mongodb-core.Server.prototype.command')
    shimmer.wrap(mongodb.Server.prototype, 'command', wrapCommand)

    log.debug('shimming mongodb-core.Server.prototype functions:', SERVER_FNS)
    shimmer.massWrap(mongodb.Server.prototype, SERVER_FNS, wrapQuery)
  }

  if (mongodb.Cursor) {
    log.debug('shimming mongodb-core.Cursor.prototype functions:', CURSOR_FNS_FIRST)
    shimmer.massWrap(mongodb.Cursor.prototype, CURSOR_FNS_FIRST, wrapCursor)
  }

  return mongodb

  function wrapCommand (orginal) {
    return function (ns, cmd) {
      const trace = agent.traceContext.currentTraceObject()
      log.debug('intercepted call to mongodb-core.Server.prototype.command %o', { ns: ns, cmd: cmd })
      let spanEventRecorder, asyncEventRecorder, asyncTrace, cb

      if (trace && arguments.length > 0) {
        const index = arguments.length - 1
        cb = arguments[index]
        if (typeof  cb === 'function') {
          let type
          if (cmd.findAndModify) type = 'findAndModify'
          else if (cmd.createIndexes) type = 'createIndexes'
          else if (cmd.ismaster) type = 'ismaster'
          else if (cmd.count) type = 'count'
          else type = 'command'

          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
          spanEventRecorder.recordApiDesc('mongodb.'+ String(type).toUpperCase()+'.call' )
          trace.traceBlockEnd(spanEventRecorder)

          asyncTrace = trace.newAsyncTrace(spanEventRecorder)
          const nextSpanId = IdGenerator.next
          asyncEventRecorder = asyncTrace.traceAsyncBegin()
          asyncEventRecorder.recordServiceType(ServiceType.mongodb)
          asyncEventRecorder.recordApiDesc(`mongodb.${type} [${ns}]`)
          asyncEventRecorder.recordApiArguments(mongoJSONData,
              convertUtils.convertStringStringValue(cmd), ValueType.stringStringValue)
          asyncEventRecorder.recordNextSpanId(nextSpanId)

          if (trace && asyncEventRecorder ) {
            arguments[index] = wrappedCallback
          }
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback() {
        log.debug('intercepted mongodb-core.Server.prototype.command callback %o', { ns: ns, cmd: cmd })
        if (asyncTrace) {
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }

  function wrapQuery (orginal, name) {
    return function (ns, cmd) {
      const trace = agent.traceContext.currentTraceObject()
      log.debug('intercepted call to mongodb-core.Server.prototype.%s %o', name, { ns: ns, cmd: cmd })
      let spanEventRecorder, asyncEventRecorder, asyncTrace, cb

      if (trace && arguments.length > 0) {
        const index = arguments.length - 1
        cb = arguments[index]
        if (typeof cb === 'function') {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
          spanEventRecorder.recordApiDesc('mongodb.'+ String(name).toUpperCase()+'.call' )
          trace.traceBlockEnd(spanEventRecorder)

          asyncTrace = trace.newAsyncTrace(spanEventRecorder)
          const nextSpanId = IdGenerator.next
          asyncEventRecorder = asyncTrace.traceAsyncBegin()
          asyncEventRecorder.recordServiceType(ServiceType.mongodb)
          asyncEventRecorder.recordApiDesc(`mongodb.${name} [${ns}]`)
          asyncEventRecorder.recordApiArguments(mongoJSONData,
              convertUtils.convertStringStringValue(cmd), ValueType.stringStringValue)
          asyncEventRecorder.recordNextSpanId(nextSpanId)

          if (trace && asyncEventRecorder) {
            arguments[index] = wrappedCallback
          }
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Server.prototype.%s callback %o', name, { ns: ns, cmd: cmd })
        if (asyncTrace) {
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }

  function wrapCursor (orginal, name) {
    return function () {
      const trace = agent.traceContext.currentTraceObject()
      let id = `${this.ns}.${this.cmd.find ? 'find' : name}`
      log.debug('intercepted call to mongodb-core.Cursor.prototype.%s %o', name, { id: id })

      let spanEventRecorder, asyncEventRecorder, asyncTrace, cb

      if (trace && arguments.length > 0) {
        cb = arguments[0]
        if (typeof cb === 'function') {
          if ( name !== 'next' || !this[firstTrace]) {
            spanEventRecorder = trace.traceBlockBegin()
            spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
            spanEventRecorder.recordApiDesc('mongodb.'+ String(id).toUpperCase()+'.call' )
            trace.traceBlockEnd(spanEventRecorder)

            asyncTrace = trace.newAsyncTrace(spanEventRecorder)
            const nextSpanId = IdGenerator.next
            asyncEventRecorder = asyncTrace.traceAsyncBegin()
            asyncEventRecorder.recordServiceType(ServiceType.mongodb)
            asyncEventRecorder.recordApiDesc(`mongodb.${id} [${this.ns}]`)
            asyncEventRecorder.recordApiArguments(mongoJSONData,
                convertUtils.convertStringStringValue(this.cmd.query), ValueType.stringStringValue)
            asyncEventRecorder.recordNextSpanId(nextSpanId)

          }
          if (trace && asyncEventRecorder) {
            arguments[0] = wrappedCallback
            if (name === 'next') {
              this[firstTrace] = true
            }
          }
        }
      }
      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Cursor.prototype.%s callback %o', name, { id: id })
        if (asyncTrace) {
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }
}


