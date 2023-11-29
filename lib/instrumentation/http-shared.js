/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const endOfStream = require('end-of-stream')
const url = require('url')
const log = require('../utils/logger')
const IdGenerator = require('../context/id-generator')
const annotationKey = require('../constant/annotation-key')
const RequestHeaderUtils = require('../instrumentation/request-header-utils')
const AntPathMatcher = require('../utils/ant-path-matcher')
const defaultPredefinedMethodDescriptorRegistry = require('../constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../context/service-type')
const localStorage = require('./context/local-storage')
const TraceBuilder = require('./context/trace-builder')

let pathMatcher
const getPathMatcher = () => {
  if (!pathMatcher) {
    pathMatcher = new AntPathMatcher(require('../config').getConfig())
  }
  return pathMatcher
}

exports.clearPathMatcher = function () {
  pathMatcher = null
}

exports.instrumentRequest = function (agent, moduleName) {
  return function (original) {
    return function (event, req, res) {
      if (event !== 'request') {
        return original.apply(this, arguments)
      }

      if (log.isInfo()) {
        log.info('instrumentRequest in http-shared.js ' + JSON.stringify(req))
      }

      const requestData = RequestHeaderUtils.read(req)
      if (getPathMatcher().matchPath(requestData.rpcName)) {
        return original.apply(this, arguments)
      }

      const trace = agent.createTraceObject(requestData)
      return localStorage.run(trace, () => {
        if (trace && trace.canSampled()) {
          recordRequest(trace.spanRecorder, requestData)
          trace.spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
          if (requestData && typeof requestData.searchParams === 'string') {
            trace.spanRecorder.recordAttribute(annotationKey.HTTP_PARAM, requestData.searchParams)
          }
        }
  
        endOfStream(res, function (err) {
          if (log.isInfo()) {
            log.info('endOfStream in http-shared.js ' + JSON.stringify(res))
          }
          if (!err) {
            if (trace && trace.canSampled()) {
              trace.spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
              return agent.completeTraceObject(trace)
            }
          }
  
          // Handle case where res.end is called after an error occurred on the
          // stream (e.g. if the underlying socket was prematurely closed)
          const end = res.end
          res.end = function () {
            const result = end.apply(this, arguments)
            if (trace && trace.canSampled()) {
              if (this.statusCode) {
                trace.spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
              }
              return agent.completeTraceObject(trace)
            }
            return result
          }
        })
        return original.apply(this, arguments)
      })
    }
  }
}

exports.traceOutgoingRequest = function (agent, moduleName) {
  return function (original) {
    return function () {
      const req = original.apply(this, arguments)

      const trace = agent.traceContext.currentTraceObject()
      if (log.isDebug()) {
        if (trace) {
          log.debug(`traceOutgoingRequest trace: ${trace}`)
        } else {
          log.debug(`traceOutgoingRequest No sampled trace`)
        }
      }
      if (!trace) return req

      if (!trace.canSampled()) {
        RequestHeaderUtils.writeHTTPSampled(req)
        return req
      }

      const spanEventRecorder = trace.traceBlockBegin()
      spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
      spanEventRecorder.recordApiDesc('http.request')
      trace.traceBlockEnd(spanEventRecorder)
      
      const asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(spanEventRecorder)
      const asyncEventRecorder = asyncTrace.traceAsyncBegin()
      asyncEventRecorder.recordServiceType(ServiceType.asyncHttpClient)
      asyncEventRecorder.recordApiDesc(req.method)
      
      let host = req.getHeader('host')
      const httpURL = host + url.parse(req.path).pathname
      asyncEventRecorder.recordAttribute(annotationKey.HTTP_URL, httpURL)
      
      const destinationId = host
      const nextSpanId = IdGenerator.next
      RequestHeaderUtils.write(req, agent, nextSpanId, destinationId)
      asyncEventRecorder.recordNextSpanId(nextSpanId)
      asyncEventRecorder.recordDestinationId(destinationId)

      req.on('response', onresponse)

      return req

      function onresponse(res) {
        log.debug('intercepted http.ClientcRequest response event %o', { id: httpURL })
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

      function onEnd() {
        log.debug('intercepted http.IncomingMessage end event %o', { id: httpURL })
        if (asyncTrace) {
          asyncEventRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
          asyncTrace.close()
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