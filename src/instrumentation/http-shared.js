'use strict'

const HttpRequestReader = require('instrumentation/http-request-reader')
const endOfStream = require('end-of-stream')
const url = require('url')

exports.instrumentRequest = function (agent, moduleName) {
    return function(original) {
        return function (event ,req, res) {
            if (event === 'request') {
                // todo. agent log
                console.log('intercepted request event call to %s.Server.prototype.emit', moduleName)
                console.warn('start instrumentRequest')

                // console.log(req)
                const httpRequestReader = new HttpRequestReader(req)
                const trace = agent.createTraceObject(httpRequestReader.getTraceId())
                recordRequest(trace.spanRecorder, httpRequestReader)

                // todo. agent setting data?


                // todo. emmiter
                // ins.bindEmitter(req)
                // ins.bindEmitter(res)

                // todo. end Of Stream ?
                endOfStream(res, function (err) {
                    if (!err) return agent.completeTraceObject(trace)
                    //
                    //
                    // console.log('E-O-S')
                    //
                    // //
                    //
                    // res.on('prefinish', function() {
                    //     console.log('TEST!')
                    // })
                })
            }
            return original.apply(this, arguments)
        }
    }
}
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

exports.traceOutgoingRequest = function (agent, moduleName) {
    return function (original) {
        return function () {
            console.warn('start traceOutgoingRequest')
            const req = original.apply(this, arguments)
            /*
            FIXME: 다음의 방법을 쓸 수 없다. ClientRequest 이기에 실행 될 때 문제가 있음.
            FIXME: 외부 호출 -> 로직 -> 응답일 경우 가장 큰 문제.
            const httpRequestReader = new HttpRequestReader(req)
            const trace = agent.createTraceObject(httpRequestReader.getTraceId())
            recordRequest(trace.spanRecorder, httpRequestReader)
            */
            const trace = agent.traceContext.currentTraceObject()
            if (!trace) return req
            // Fixme :  Trace id !?
            const id = 'TEST'

            const name = req.method + ' ' + req._headers.host + url.parse(req.path).pathname
            const spanEventRecorder = trace.traceBlockBegin()
            // FIXME : Http 호출이 어디서 나가는 지 알수가 없음. Type을 추가해야할 듯함.
            spanEventRecorder.recordServiceType(ServiceTypeCode.koa)
            spanEventRecorder.recordApi(name)

            req.on('response', onresponse)

            return req

            function onresponse (res) {
                console.debug('intercepted http.ClientRequest response event %o', { id: id })
                // Inspired by:
                // https://github.com/nodejs/node/blob/9623ce572a02632b7596452e079bba066db3a429/lib/events.js#L258-L274
                if (res.prependListener) {
                    res.prependListener('end', onEnd)
                } else {
                    const existing = res._events && res._events.end
                    if (!existing) {
                        res.on('end', onEnd)
                    } else {
                        if (typeof existing === 'function') {
                            res._events.end = [onEnd, existing]
                        } else {
                            existing.unshift(onEnd)
                        }
                    }
                }
            }

            function onEnd () {
                console.debug('intercepted http.IncomingMessage end event %o', { id: id })
                if (trace) {
                    trace.traceBlockEnd(spanEventRecorder)
                }
            }
        }
    }
}

const recordRequest = (recorder, reader) => {
  recorder.recordRpc(reader.rpcName)
  recorder.recordEndPoint(reader.endPoint)
  recorder.recordRemoteAddr(reader.remoteAddress)
}
