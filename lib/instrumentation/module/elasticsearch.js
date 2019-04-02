'use strict'

const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const log = require('../../utils/logger')
const ValueType = require('../../constant/valued-type').ValuedType
const EventAnnotationKey = require('../../constant/annotation-key').EventAnnotationKey
const convertUtils = require('../../utils/convert-utils')

const searchRegexp = /_search$/

module.exports = function (agent, version, elasticsearch) {

  shimmer.wrap(elasticsearch.Transport && elasticsearch.Transport.prototype, 'request', wrapRequest)

  return elasticsearch

  function wrapRequest(original) {
    return function wrappedRequest (params, cb) {
      const trace = agent.traceContext.currentTraceObject()
      const method = params && params.method
      const path = params && params.path
      const query = params && params.query
      let spanEventRecorder

      log.debug('intercepted call to elasticsearch.Transport.prototype.request %o', { method: method, path: path })

      if (trace && method && path) {

        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.elasticsearch)
        spanEventRecorder.recordApiDesc( `Elasticsearch: ${method} ${path}`)

        if (query && searchRegexp.test(path)) {
          // FIXME. Collection annotation key not defined
          spanEventRecorder.recordApiArguments(
              EventAnnotationKey.MONGO_JSON_DATA,
              convertUtils.convertStringStringValue(query),
              ValueType.stringStringValue)
        }

        if (typeof cb === 'function') {
          const args = Array.prototype.slice.call(arguments)
          args[1] = function () {
            let result
            try {
              result = cb.apply(this, arguments)
            } catch (e) {
              spanEventRecorder.recordException(e, true)
              e.record = true
              throw e
            } finally {
              if (trace) {
                trace.traceBlockEnd(spanEventRecorder)
              }
            }
            return result
          }
          return original.apply(this, arguments)
        } else {
          const p = original.apply(this, arguments)
          p.then().catch((e) => {
            if (!e._pinpointCheck) {
              spanEventRecorder.recordException(e, true)
              e._pinpointCheck = true
            }
            throw e
          }).finally(() =>{
            if (trace) {
              trace.traceBlockEnd(spanEventRecorder)
            }
          })
          return p
        }
      } else {
        log.debug('could not instrument elasticsearch request')
        return original.apply(this, arguments)
      }
    }
  }
}
