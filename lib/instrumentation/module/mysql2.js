'use strict'

const semver = require('semver')
const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')

module.exports = function (agent, version, mysql2) {

  if (!semver.satisfies(version, '^1.0.0')) {
    log.debug('mysql2 version %s not supported - aborting...', version)
    return mysql2
  }

  shimmer.massWrap(mysql2.Connection.prototype, ['query', 'execute'], wrapQuery)

  return mysql2

  function wrapQuery(original) {
    return function wrappedQuery(sql, values, cb) {
      let hasCallback = false
      let sqlStr

      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder, asyncEventRecorder, asyncTrace

      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(
            ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL)
        spanEventRecorder.recordApiDesc('mysql2.call')
        trace.traceBlockEnd(spanEventRecorder)

        switch (typeof sql) {
          case 'string':
            sqlStr = sql
            break
          case 'object':
            if (typeof sql.onResult === 'function') {
              sql.onResult = wrapCallback(sql.onResult)
            }
            sqlStr = sql.sql
            break
          case 'function':
            arguments[0] = wrapCallback(sql)
            break
        }

        const nextSpanId = IdGenerator.next
        asyncTrace = trace.newAsyncTrace(spanEventRecorder)
        asyncEventRecorder = trace.traceAsyncBegin()
        asyncEventRecorder.recordServiceType(ServiceTypeCode.mysql)
        asyncEventRecorder.recordApiDesc(`mysql.${objType}.query `)
        asyncEventRecorder.recordNextSpanId(nextSpanId)

        if (trace && sqlStr) { // TODO. this point
          asyncEventRecorder.recordApiArguments(
              EventAnnotationKey.MONGO_JSON_DATA,
              convertUtils.convertStringStringValue(sqlStr),
              ValueType.stringStringValue)
        }

        if (typeof values === 'function') {
          arguments[1] = wrapCallback(values)
        } else if (typeof cb === 'function') {
          arguments[2] = wrapCallback(cb)
        }

        const result = original.apply(this, arguments)

        if (result && !hasCallback) {
          if (asyncTrace) {
            shimmer.wrap(result, 'emit', function (original) {
              return function (event) {
                switch (event) {
                  case 'error':
                  case 'close':
                  case 'end':
                    asyncTrace.traceAsyncEnd(asyncEventRecorder)
                }
                return original.apply(this, arguments)
              }
            })
          }
        }
      }

      return result

      function wrapCallback(cb) {
        hasCallback = true
        return trace ? wrappedCallback : cb

        function wrappedCallback() {
          trace.traceAsyncEnd(asyncEventRecorder)
          return cb.apply(this, arguments)
        }
      }
    }
  }
