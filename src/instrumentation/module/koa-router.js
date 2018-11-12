'use strict'

const shimmer = require('shimmer')

module.exports = function(agent, version, router) {
    // todo. versioning


    shimmer.wrap(router.prototype, 'match', function(original) {
        return function (_, method) {       //
            // todo. method type 확인  - > route에서 들어오는 값들
            if (agent.currentContext) {
                const spanEventRecorder = agent.currentContext.spanEventRecorder
                spanEventRecorder.recordStartTime(Date.now())
            }
            return original.apply(this, arguments)
        }
    })
}
