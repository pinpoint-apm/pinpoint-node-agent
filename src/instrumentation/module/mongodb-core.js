'use strict'

const shimmer = require('shimmer')
const semver = require('semver')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const log = require('utils/logger')

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
      let spanEventRecorder
      let cb
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
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApiDesc(`db.mongodb.query [${ns}.${type}]`)
          // Todo. arguments -> cmd
        }
      }

      const result =  orginal.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('intercepted mongodb-core.Server.prototype.command callback %o', { ns: ns, cmd: cmd })
      return result
    }
  }

  function wrapQuery (orginal, name) {
    return function (ns, cmd) {
      const trace = agent.traceContext.currentTraceObject()
      log.debug('intercepted call to mongodb-core.Server.prototype.%s %o', name, { ns: ns, cmd: cmd })
      let spanEventRecorder
      let cb
      if (trace && arguments.length > 0) {
        const index = arguments.length - 1
        cb = arguments[index]
        if (typeof cb === 'function') {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApiDesc(`db.mongodb.query [${ns}.${name}]`)
          // Todo. arguments -> cmd
        }
      }
      const result = orginal.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('intercepted mongodb-core.Server.prototype.%s callback %o', name, { ns: ns, cmd: cmd })
      return result

    }
  }

  function wrapCursor (orginal, name) {
    return function () {
      const trace = agent.traceContext.currentTraceObject()
      const id = `${this.ns}.${this.cmd.find ? 'find' : name}`
      log.debug('intercepted call to mongodb-core.Cursor.prototype.%s %o', name, { id: id })
      let spanEventRecorder
      let cb
      if (trace && arguments.length > 0) {
        cb = arguments[0]
        if (typeof cb === 'function') {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApiDesc(`db.mongodb.query [${id}]`)
          // Todo. arguments -> this.cmd.query
        }
      }
      const result = orginal.apply(this, arguments)
      if (trace) {
        trace.traceBlockEnd(spanEventRecorder)
      }
      log.debug('intercepted mongodb-core.Cursor.prototype.%s callback %o', name, { id: id })
      return result
    }
  }
}
