'use strict'

const shimmer = require('shimmer')
const semver = require('semver')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const ValueType = require('../../constant/valued-type').ValuedType
const EventAnnotationKey = require('../../constant/annotation-key').EventAnnotationKey
const convertUtils = require('../../utils/convert-utils')

const log = require('../../utils/logger')

const SERVER_FNS = ['insert', 'update', 'remove', 'auth']
const CURSOR_FNS_FIRST = ['_find', '_getmore']

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
      let spanEventRecorder, dummyId, cb

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

          dummyId = trace.traceBlockDummy(ServiceTypeCode.callback_dummy)

          spanEventRecorder = trace.traceCallbackBegin(dummyId)
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApiDesc(`mongodb.${type} [${ns}]`)
          spanEventRecorder.recordApiArguments(EventAnnotationKey.MONGO_JSON_DATA,
              convertUtils.convertStringStringValue(cmd), ValueType.stringStringValue)

          if (trace) {
            arguments[index] = wrappedCallback
          }
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback() {
        log.debug('intercepted mongodb-core.Server.prototype.command callback %o', { ns: ns, cmd: cmd })
        if (trace) {
          trace.traceCallbackEnd(spanEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }

  function wrapQuery (orginal, name) {
    return function (ns, cmd) {
      const trace = agent.traceContext.currentTraceObject()
      log.debug('intercepted call to mongodb-core.Server.prototype.%s %o', name, { ns: ns, cmd: cmd })
      let spanEventRecorder, dummyId, cb

      if (trace && arguments.length > 0) {
        const index = arguments.length - 1
        cb = arguments[index]
        if (typeof cb === 'function') {
          dummyId = trace.traceBlockDummy(ServiceTypeCode.callback_dummy)


          spanEventRecorder = trace.traceCallbackBegin(dummyId)
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApiDesc(`mongodb.${name} [${ns}]`)
          spanEventRecorder.recordApiArguments(EventAnnotationKey.MONGO_JSON_DATA,
              convertUtils.convertStringStringValue(cmd), ValueType.stringStringValue)

          if (trace) {
            arguments[index] = wrappedCallback
          }
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Server.prototype.%s callback %o', name, { ns: ns, cmd: cmd })
        if (trace) {
          trace.traceCallbackEnd(spanEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }

  function wrapCursor (orginal, name) {
    return function () {
      const trace = agent.traceContext.currentTraceObject()
      const id = `${this.ns}.${this.cmd.find ? 'find' : name}`
      log.debug('intercepted call to mongodb-core.Cursor.prototype.%s %o', name, { id: id })

      let spanEventRecorder, dummyId, cb

      if (trace && arguments.length > 0) {
        cb = arguments[0]
        console.trace()


        if (typeof cb === 'function') {
          if ( name !== 'next' || !this[firstTrace]) {
            dummyId = trace.traceBlockDummy(ServiceTypeCode.callback_dummy)

            spanEventRecorder = trace.traceCallbackBegin(dummyId)
            spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
            spanEventRecorder.recordApiDesc(`mongodb.${this.cmd.find ? 'find' : name} [${this.ns}]`)
            spanEventRecorder.recordApiArguments(EventAnnotationKey.MONGO_JSON_DATA,
                convertUtils.convertStringStringValue(this.cmd.query), ValueType.stringStringValue)
          }
          if (trace) {
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
        if (trace) {
          trace.traceCallbackEnd(spanEventRecorder)
        }
        return cb.apply(this, arguments)
      }
    }
  }
}


