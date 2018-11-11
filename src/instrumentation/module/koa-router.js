'use strict'

const shimmer = require('shimmer')

module.exports = function(agent, router) {
//    todo. versioning
    shimmer.wrap(router.prototype, 'match', function(original) {
        return function (_, method) {
            if (agent.currentContext()) {
                const spanEventRecorder = agent.currentContext.spanEventRecorder
                spanEventRecorder.recordStartTime(Date.now())

                if (req == post ) {
                    spanEventRecorder.recoradCreate(_)

                }


            }
            return original.apply(this, arguments)
        }
    })


}
