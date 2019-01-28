'use strict'

const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const AsyncIdAccessor = require('../../context/async-id-accessor')

module.exports = function(agent, version, request) {

  shimmer.wrap(request, 'get', function (original) {
    return function () {

      const trace = agent.traceContext.currentTraceObject()
      let spanEventRecorder = null
      if (trace) {
        spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL)
        spanEventRecorder.recordApiDesc('request.get')
      }
      const result = original.apply(this, arguments)
      if (trace) {

        let asyncId = spanEventRecorder.recordNextAsyncId()
        AsyncIdAccessor.setAsyncId(result, asyncId)

        trace.traceBlockEnd(spanEventRecorder)
      }


      return result
    }
  })

  return request
}

