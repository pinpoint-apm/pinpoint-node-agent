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

module.exports = function(agent, version, mysql) {
  if (!semver.satisfies(version, '^2.0.0')) {
    log.debug('mysql version %s not supported - aborting...', version)
    return mysql
  }

  log.debug('shimming mysql.createPool')
  shimmer.wrap(mysql, 'createPool', wrapCreatePool)

  log.debug('shimming mysql.createPoolCluster')
  shimmer.wrap(mysql, 'createPoolCluster', wrapCreatePoolCluster)

  log.debug('shimming mysql.createConnection')
  shimmer.wrap(mysql, 'createConnection', wrapCreateConnection)

  return mysql


  function wrapCreateConnection (original) {
    return function wrappedCreateConnection () {
      const connection = original.apply(this, arguments)

      wrapQueryable(connection, 'connection', agent)

      return connection
    }
  }

  function wrapCreatePool (original) {
    return function wrappedCreatePool () {
      const pool = original.apply(this, arguments)

      log.debug('shimming mysql pool.getConnection')
      shimmer.wrap(pool, 'getConnection', wrapGetConnection)

      return pool
    }
  }

  function wrapCreatePoolCluster (original) {
    return function wrappedCreatePoolCluster () {
      const cluster = original.apply(this, arguments)

      log.debug('shimming mysql cluster.of')
      shimmer.wrap(cluster, 'of', function wrapOf (original) {
        return function wrappedOf () {
          const ofCluster = original.apply(this, arguments)

          log.debug('shimming mysql cluster of.getConnection')
          shimmer.wrap(ofCluster, 'getConnection', wrapGetConnection)

          return ofCluster
        }
      })
      return cluster
    }
  }

  function wrapGetConnection (original) {
    return function wrappedGetConnection () {
      const cb = arguments[0]

      if (typeof cb === 'function') {
        arguments[0] = function bindFunction() {
          return function wrapedCallback (err, connection) {
            // eslint-disable-line handle-callback-err
            if (connection) wrapQueryable(connection, 'getConnection() > connection', agent)
            return cb.apply(this, arguments)
          }
        }
      }
      return original.apply(this, arguments)
    }
  }

  function wrapQueryable (obj, objType, agent) {
    log.debug('shimming mysql %s.query', objType)
    shimmer.wrap(obj, 'query', wrapQuery)

    function wrapQuery (original) {
      return function wrappedQuery (sql, values, cb) {
        let hasCallback = false
        let sqlStr

        const trace = agent.traceContext.currentTraceObject()
        let spanEventRecorder, asyncEventRecorder, asyncTrace

        if (trace) {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL)
          spanEventRecorder.recordApiDesc('mysql.'+ String(sql).toUpperCase()+'.call' )
          trace.traceBlockEnd(spanEventRecorder)

          switch (typeof sql) {
            case 'string':
              sqlStr = sql
              break
            case 'object':
              if (typeof sql._callback === 'function') {
                sql._callback = wrapCallback(sql._callback)
              }
              sqlStr = sql.sql
              break
            case 'function':
              arguments[0] = wrapCallback(sql)
              break
          }

          const nextSpanId = IdGenerator.next
          asyncTrace = trace.newAsyncTrace(spanEventRecorder)
          asyncEventRecorder = asyncTrace.traceAsyncBegin()
          asyncEventRecorder.recordServiceType(ServiceTypeCode.mysql)
          asyncEventRecorder.recordApiDesc(`mysql.${objType}.query `)
          asyncEventRecorder.recordNextSpanId(nextSpanId)

          if (sqlStr) { // TODO. this point
            asyncEventRecorder.recordApiArguments(EventAnnotationKey.MONGO_JSON_DATA,
                convertUtils.convertStringStringValue(sqlStr), ValueType.stringStringValue)
          }

          if (typeof values === 'function') {
            arguments[1] = wrapCallback(values)
          } else if (typeof cb === 'function') {
            arguments[2] = wrapCallback(cb)
          }
        }

        const result = original.apply(this, arguments)

        if (asyncTrace && result && !hasCallback) {
          shimmer.wrap(result, 'emit', function (original) {
            return function (event) {
              switch (event) {
                case 'error':
                case 'end':
                  asyncTrace.traceAsyncEnd(asyncEventRecorder)
              }
              return original.apply(this, arguments)
            }
          })
        }

        return result

        function wrapCallback (cb) {
          hasCallback = true
          return function wrappedCallback () {
            if (trace) {
              trace.traceAsyncEnd(asyncEventRecorder)
            }
            return cb.apply(this, arguments)
          }
        }
      }
    }
}


}
