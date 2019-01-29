'use strict'

const endOfStream = require('end-of-stream')
const url = require('url')
const log = require('../utils/logger')
const IdGenerator = require('../context/id-generator')
const AsyncIdAccessor = require('../context/async-id-accessor')
const DefaultAnnotationKey = require('../constant/annotation-key').DefaultAnnotationKey

const RequestHeaderUtils = require('../instrumentation/request-header-utils')
const GeneralMethodDescriptor = require('../constant/method-descriptor').GeneralMethodDescriptor

exports.instrumentRequest = function (agent, moduleName) {
  return function(original) {
    return function (event ,req, res) {
      if (event === 'request') {
        log.debug('intercepted request event call to %s.Server.prototype.emit', moduleName)
        log.warn('start instrumentRequest')

        const requestData = RequestHeaderUtils.read(req)
        const trace = agent.createTraceObject(requestData)
        if (trace && trace.canSampled()) {
          recordRequest(trace.spanRecorder, requestData)
          trace.spanRecorder.recordApi(GeneralMethodDescriptor.SERVER_REQUEST)
        }

        endOfStream(res, function (err) {
          if (!err) {
            if (trace && trace.canSampled()) {
              return agent.completeTraceObject(trace)
            }
          }
          // todo. status error ? how to ?
          res.on('prefinish', function() {
            if (trace && trace.canSampled()) {
              agent.completeTraceObject(trace)
            }
          })
        })
      }
      return original.apply(this, arguments)
    }
  }
}
const ServiceTypeCode = require('../constant/service-type').ServiceTypeCode

exports.traceOutgoingRequest = function (agent, moduleName) {
  return function (original) {
    return function () {
      log.warn('start traceOutgoingRequest')
      const req = original.apply(this, arguments)
      const trace = agent.traceContext.currentTraceObject()
      if (!trace) return req
      // Fixme :  Trace id !?

      let spanEventRecorder;
      let asyncId;

      // If request object has an asyncId, use request object's one
      if (arguments && arguments[0] && AsyncIdAccessor.getAsyncId(arguments[0])) {
        asyncId = AsyncIdAccessor.getAsyncId(arguments[0]);
      } else {
        spanEventRecorder = trace.traceBlockBegin();
        spanEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT_INTERNAL)
        spanEventRecorder.recordApiDesc('http.request')
        asyncId = spanEventRecorder.recordNextAsyncId()
        trace.traceBlockEnd(spanEventRecorder);
      }

      const id = 'TEST'   // ?
      const name = req.method + ' ' + req._headers.host + url.parse(req.path).pathname

      const destinationId = req._headers.host
      const nextSpanId = IdGenerator.next
      RequestHeaderUtils.write(req, agent, nextSpanId, destinationId)

      const asyncEventRecorder = trace.traceAsyncBegin(asyncId)
      asyncEventRecorder.recordServiceType(ServiceTypeCode.ASYNC_HTTP_CLIENT)
      asyncEventRecorder.recordApiDesc(name)
      asyncEventRecorder.recordNextSpanId(nextSpanId)
      asyncEventRecorder.recordDestinationId(destinationId)

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
          asyncEventRecorder.recordAttribute(DefaultAnnotationKey.HTTP_STATUS_CODE, this.statusCode)
          trace.traceAsyncEnd(asyncEventRecorder);
        }
      }
    }
  }
}

const recordRequest = (recorder, requestData) => {
  recorder.recordRpc(requestData.rpcName)
  recorder.recordEndPoint(requestData.endPoint)
  recorder.recordRemoteAddr(requestData.remoteAddress)
}
