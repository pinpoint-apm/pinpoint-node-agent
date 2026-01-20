/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const endOfStream = require('end-of-stream')
const annotationKey = require('../constant/annotation-key')
const ServiceType = require('../context/service-type')
const localStorage = require('./context/local-storage')
const HttpRequestTraceBuilder = require('./http/http-request-trace-builder')
const HttpClientRequest = require('./http/http-client-request')
const OutgoingClientRequestHeaderWriter = require('./http/outgoing-client-request-header-writer')

exports.instrumentRequest = function (agent) {
  return function (original) {
    return function (event, req, res) {
      if (event !== 'request') {
        return original.apply(this, arguments)
      }

      const requestTrace = new HttpRequestTraceBuilder(agent.getTraceContext(), req).build()
      const trace = requestTrace.makeTrace()
      return localStorage.run(trace, () => {
        endOfStream(res, function (err) {
          const spanRecorder = trace.getSpanRecorder()
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

          const config = agent.getTraceContext().getConfig()
          if (config.isUriStatsEnabled()) {
            spanRecorder.recordUriTemplate(requestTrace.getRpcName())
          }

          if (config.isUriStatsHttpMethodEnabled()) {
            spanRecorder.recordUriHttpMethod(req.method)
          }
          return agent.completeTraceObject(trace)
        })
        return original.apply(this, arguments)
      })
    }
  }
}

// HttpMethodBaseExecuteMethodInterceptor.java: before
exports.traceOutgoingRequest = function (agent) {
  return function (original) {
    return function () {
      const req = original.apply(this, arguments)

      const traceContext = agent.getTraceContext()
      const trace = traceContext.currentTraceObject()
      if (!trace) {
        return req
      }

      const clientRequest = new HttpClientRequest(req)
      const headerWriter = new OutgoingClientRequestHeaderWriter(clientRequest)
      if (!trace.canSampled()) {
        headerWriter.writeSampledHeaderFalse()
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
      recorder.recordApiDesc(clientRequest.getMethod())
      recorder.recordAttribute(annotationKey.HTTP_URL, clientRequest.getHostWithPathname())

      const nextId = childTraceBuilder.getTraceId().getNextTraceId()
      recorder.recordNextSpanId(nextId.getSpanId())
      recorder.recordDestinationId(clientRequest.getHost())
      headerWriter.write(nextId, agent.getAgentInfo())

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