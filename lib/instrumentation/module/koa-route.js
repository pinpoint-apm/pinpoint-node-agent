/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('shimmer')
const ServiceTypeCode = require('../../constant/service-type').ServiceTypeCode
const methods = require('methods')

module.exports = function(agent, version, route) {
  // todo. route 쓸지 검토
  methods.forEach(function (method) {
    shimmer.wrap(route, method, function (shimmer, methodFn) {
      return function () {
        const trace = agent.traceContext.currentTraceObject()
        let spanEventRecorder
        if (trace) {
          spanEventRecorder = trace.traceBlockBegin()
          spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
          spanEventRecorder.recordApi('koa.route.get')
        }
        const result = methodFn.apply(route, arguments)
        if (trace) {
          trace.traceBlockEnd(spanEventRecorder)
        }

        return result
      }
    })
  })

  return route
}
