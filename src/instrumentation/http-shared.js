'use strict'

exports.instrumentRequest = function (agent, moduleName) {
    return function(original) {
        return function (event ,req, res) {
            if (event === 'request') {
                // todo. agent log
                console.log('intercepted request event call to %s.Server.prototype.emit', moduleName)
                // blackist ?
                agent.createNewContext()
                // todo. agent setting data?

                // todo. end Of Stream ?
            }
            return original.apply(this, arguments)
        }
    }
}
