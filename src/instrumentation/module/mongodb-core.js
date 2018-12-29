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

  /**
   *
   * @param orig
   * @returns {wrappedFunction}
   */
  function wrapCommand (orginal) {
    return function wrappedFunction (ns, cmd, k, j) {
      const trace = agent.traceContext.currentTraceObject()

      const id = 'mongodbTestCommandId'  // todo. 협의 후 기록 혹은 삭제

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
          spanEventRecorder.recordApi(ns + '.' + type, 'db.mongodb.query')

          arguments[index] = wrappedCallback
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Server.prototype.command callback %o', { id: id })
        trace.traceBlockEnd(spanEventRecorder)
        return cb.apply(this, arguments)
      }

    }
  }

  function wrapQuery (orginal, name) {
    return function wrappedFunction(ns) {
      const trace = agent.traceContext.currentTraceObject()

      const id = 'mongodbTestQueryId' // todo. 협의 후 기록 혹은 삭제

      let spanEventRecorder
      let cb

      if (trace && arguments.length > 0) {
        const index = arguments.length - 1
        cb = arguments[index]
        if (typeof cb === 'function') {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApi(ns + '.' + name, 'db.mongodb.query')

          arguments[index] = wrappedCallback
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Server.prototype.command callback %o', { id: id })
        trace.traceBlockEnd(spanEventRecorder)
        return cb.apply(this, arguments)
      }
    }
  }

  function wrapCursor (orginal, name) {
    return function wrappedFunction () {
      const trace = agent.traceContext.currentTraceObject()

      const id = 'mongodbTestCursorId' // todo. 협의 후 기록 혹은 삭제

      log.debug('intercepted call to mongodb-core.Cursor.prototype.%s %o', name, { id: id })

      let spanEventRecorder
      let cb
      if (trace && arguments.length > 0) {
        cb = arguments[0]
        if (typeof cb === 'function') {
          const spanName = `${this.ns}.${this.cmd.find ? 'find' : name}`

          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)
          spanEventRecorder.recordApi(spanName, 'db.mongodb.query')

          arguments[0] = wrappedCallback
        }
      }

      return orginal.apply(this, arguments)

      function wrappedCallback () {
        log.debug('intercepted mongodb-core.Cursor.prototype.%s callback %o', name, { id: id })
        trace.traceBlockEnd(spanEventRecorder)

        return cb.apply(this, arguments)
      }
    }
  }
}
