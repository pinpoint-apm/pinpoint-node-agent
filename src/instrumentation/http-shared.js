'use strict'

const endOfStream = require('end-of-stream')
const url = require('url')
const log = require('utils/logger')

const HttpRequestReader = require('instrumentation/http-request-reader')
const HttpRequestWriter = require('instrumentation/http-request-writer')
const HttpMethodDescritpor = require('constant/method-descriptor').HttpMethodDescritpor

exports.instrumentRequest = function (agent, moduleName) {
  return function(original) {
    return function (event ,req, res) {
      if (event === 'request') {
        log.debug('intercepted request event call to %s.Server.prototype.emit', moduleName)
        log.warn('start instrumentRequest')

        const httpRequestReader = new HttpRequestReader(req)
        const trace = agent.createTraceObject(httpRequestReader.getTraceId())
        recordRequest(trace.spanRecorder, httpRequestReader)
        trace.spanRecorder.recordApiId(HttpMethodDescritpor.SERVER_REQUEST.apiId)
        // todo. emmiter
        // ins.bindEmitter(req)
        // ins.bindEmitter(res)
        endOfStream(res, function (err) {
          if (!err) return agent.completeTraceObject(trace)
          // todo. status error ? how to ?
          res.on('prefinish', function() {
            agent.completeTraceObject(trace)
          })
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
      log.warn('start traceOutgoingRequest')
      const req = original.apply(this, arguments)
      const trace = agent.traceContext.currentTraceObject()
      if (!trace) return req
      // Fixme :  Trace id !?
      new HttpRequestWriter(agent).write(req)

      const id = 'TEST'   // ?
      const name = req.method + ' ' + req._headers.host + url.parse(req.path).pathname
      const spanEventRecorder = trace.traceBlockBegin()
      spanEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT)
      spanEventRecorder.recordApiDesc(name)

      req.on('response', onresponse)

      return req

      function onresponse (res) {
        log.debug('intercepted http.ClientcRequest response event %o', { id: id })
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
        log.debug('intercepted http.IncomingMessage end event %o', { id: id })
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
