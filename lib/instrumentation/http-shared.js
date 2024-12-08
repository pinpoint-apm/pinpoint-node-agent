/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const endOfStream = require('end-of-stream')
const url = require('url')
const log = require('../utils/logger')
const SpanId = require('../context/span-id')
const annotationKey = require('../constant/annotation-key')
const RequestHeaderUtils = require('../instrumentation/request-header-utils')
const AntPathMatcher = require('../utils/ant-path-matcher')
const defaultPredefinedMethodDescriptorRegistry = require('../constant/default-predefined-method-descriptor-registry')
const ServiceType = require('../context/service-type')
const localStorage = require('./context/local-storage')
const TraceBuilder = require('./context/trace-builder')
const HttpRequestTraceBuilder = require('./http/http-request-trace-builder')
const HttpOutgoingRequestHeader = require('./http/http-outgoing-request-header')

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

exports.instrumentRequest2 = function (agent) {
  return function (original) {
    return function (event, req, res) {
      if (event !== 'request') {
        return original.apply(this, arguments)
      }

      const requestTrace = new HttpRequestTraceBuilder(agent.getTraceContext(), req).build()
      const trace = requestTrace.makeTrace()
      return localStorage.run(trace, () => {
        endOfStream(res, function (err) {
          const spanRecorder = trace.spanRecorder
          if (err) {
            const end = res.end
            res.end = function () {
              const result = end.apply(this, arguments)
              spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
              agent.completeTraceObject(trace)
              return result
            }
            return
          }

          spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
          return agent.completeTraceObject(trace)
        })
        return original.apply(this, arguments)
      })
    }
  }
}

exports.instrumentRequest = function (agent) {
  return function (original) {
    return function (event, req, res) {
      if (event !== 'request') {
        return original.apply(this, arguments)
      }

      const requestData = RequestHeaderUtils.read(req)
      if (getPathMatcher().matchPath(requestData.rpcName)) {
        return original.apply(this, arguments)
      }

      const trace = agent.createTraceObject(requestData)
      return localStorage.run(trace, () => {
        if (!trace) {
          return original.apply(this, arguments)
        }

        if (typeof trace.canSampled === 'function' && !trace.canSampled()) {
          const result = original.apply(this, arguments)
          agent.completeTraceObject(trace)
          return result
        }

        trace.spanRecorder.recordRpc(requestData.rpcName)
        trace.spanRecorder.recordEndPoint(requestData.endPoint)
        trace.spanRecorder.recordRemoteAddr(requestData.remoteAddress)
        trace.spanRecorder.recordApi(defaultPredefinedMethodDescriptorRegistry.nodeServerMethodDescriptor)
        if (requestData && typeof requestData.searchParams === 'string') {
          trace.spanRecorder.recordAttribute(annotationKey.HTTP_PARAM, requestData.searchParams)
        }

        endOfStream(res, function (err) {
          if (log.isInfo()) {
            log.info('endOfStream in http-shared.js ' + JSON.stringify(res))
          }
          if (!err) {
            trace.spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
            return agent.completeTraceObject(trace)
          }

          // Handle case where res.end is called after an error occurred on the
          // stream (e.g. if the underlying socket was prematurely closed)
          const end = res.end
          res.end = function () {
            const result = end.apply(this, arguments)
            if (this.statusCode) {
              trace.spanRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
            }
            agent.completeTraceObject(trace)
            return result
          }
        })
        return original.apply(this, arguments)
      })
    }
  }
}

// HttpMethodBaseExecuteMethodInterceptor.java: before
exports.traceOutgoingRequest2 = function (agent) {
  return function (original) {
    return function () {
      const req = original.apply(this, arguments)

      const traceContext = agent.getTraceContext()
      const trace = traceContext.currentTraceObject()
      if (!trace) {
        return req
      }

      const requestHeader = new HttpOutgoingRequestHeader(agent.getAgentInfo(), req)
      if (!trace.canSampled()) {
        requestHeader.writeSampledHeaderFalse()
        return req
      }

      const spanEventRecorder = trace.traceBlockBegin()
      spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
      spanEventRecorder.recordApiDesc('http.request')
      const asyncId = spanEventRecorder.getNextAsyncId()
      trace.traceBlockEnd(spanEventRecorder)

      // DefaultAsyncContext.java: newAsyncContextTrace
      const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
      const recorder = childTraceBuilder.traceBlockBegin()
      recorder.recordServiceType(ServiceType.asyncHttpClient)
      recorder.recordApiDesc(req.method)
      recorder.recordAttribute(annotationKey.HTTP_URL, requestHeader.getHostWithPathname())

      const nextId = childTraceBuilder.getTraceId().getNextTraceId()
      recorder.recordNextSpanId(nextId.getSpanId())
      recorder.recordDestinationId(requestHeader.getHost())
      requestHeader.write(nextId)

      req.on('response', function (res) {
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
      })

      function onEnd() {
        recorder?.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
        childTraceBuilder?.traceBlockEnd(recorder)
        childTraceBuilder?.close()
      }
      return req
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

      // AsyncEntryInterceptor.java: after
      const spanEventRecorder = trace.traceBlockBegin()
      spanEventRecorder.recordServiceType(ServiceType.asyncHttpClientInternal)
      spanEventRecorder.recordApiDesc('http.request')
      spanEventRecorder.recordNextAsyncId()
      trace.traceBlockEnd(spanEventRecorder)

      const asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(spanEventRecorder.getLocalAsyncId())
      const asyncEventRecorder = asyncTrace.traceAsyncBegin()
      asyncEventRecorder.recordServiceType(ServiceType.asyncHttpClient)
      asyncEventRecorder.recordApiDesc(req.method)

      let host = req.getHeader('host')
      const httpURL = host + url.parse(req.path).pathname
      asyncEventRecorder.recordAttribute(annotationKey.HTTP_URL, httpURL)

      const destinationId = host
      const nextSpanId = SpanId.newSpanId()
      RequestHeaderUtils.write(req, agent, nextSpanId, destinationId)
      asyncEventRecorder.recordNextSpanId(nextSpanId)
      asyncEventRecorder.recordDestinationId(destinationId)

      req.on('response', onresponse)

      return req

      function onresponse(res) {
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
        if (asyncTrace) {
          asyncEventRecorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, this.statusCode)
          asyncTrace.traceAsyncEnd(asyncEventRecorder)
          asyncTrace.close()
        }
      }
    }
  }
}