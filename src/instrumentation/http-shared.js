'use strict'

const HttpRequestReader = require('instrumentation/http-request-reader')

exports.instrumentRequest = function (agent, moduleName) {
    return function(original) {
        return function (event ,req, res) {
            if (event === 'request') {
                // todo. agent log
                console.log('intercepted request event call to %s.Server.prototype.emit', moduleName)
                // blackist ?
                const httpRequestReader = new HttpRequestReader(req)
                const trace = agent.createTraceObject(httpRequestReader.getTraceId())
                recordRequest(trace.spanRecorder, httpRequestReader)
                // todo. agent setting data?

                // todo. end Of Stream ?
            }
            return original.apply(this, arguments)
        }
    }
}

const recordRequest = (recorder, reader) => {
  recorder.recordRpc(reader.rpcName)
  recorder.recordEndPoint(reader.endPoint)
  recorder.recordRemoteAddr(reader.remoteAddress)
}
