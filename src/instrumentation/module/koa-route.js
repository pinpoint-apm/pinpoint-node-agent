'use strict'

const shimmer = require('shimmer')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode
const methods = require('methods')

module.exports = function(agent, version, route) {
    methods.forEach(function (method) {
        shimmer.wrap(route, method, function (shimmer, methodFn) {
            return function () {       //
                const trace = agent.traceContext.currentTraceObject()
                let spanEventRecorder
                if (trace) {
                    spanEventRecorder = trace.traceBlockBegin()
                    spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                    spanEventRecorder.recordApi('express.get')
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
