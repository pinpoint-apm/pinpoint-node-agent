'use strict'

const shimmer = require('shimmer')

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

module.exports = function(agent, version, router) {
    // todo. versioning


    shimmer.wrap(router.prototype, 'match', function(original) {
        return function (_, method) {       //
            const trace = agent.traceContext.currentTraceObject()
            let spanEventRecorder
            if (trace) {
                spanEventRecorder = trace.traceBlockBegin()
                spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
                spanEventRecorder.recordApi('express.get')
            }

            const result = original.apply(this, arguments)

            if (trace) {
                trace.traceBlockEnd(spanEventRecorder)
            }

            return result
        }
    })

    return router
}
