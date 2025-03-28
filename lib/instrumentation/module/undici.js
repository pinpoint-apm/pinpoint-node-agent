/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const diagnosticsChannel = require('node:diagnostics_channel')
const log = require('../../utils/logger')
const ServiceType = require('../../context/service-type')
const annotationKey = require('../../constant/annotation-key')
const UndiciClientRequest = require('../http/undici-client-request')
const OutgoingClientRequestHeaderWriter = require('../http/outgoing-client-request-header-writer')
const childTraceContextSymbol = Symbol('childTraceContext')

// https://nodejs.org/ko/learn/getting-started/fetch
// fetch API is called by undici import or nodejs global fetch
// so we need to instrument require-in-the-middle and call manually to instrument fetch API
class UndiciInstrumentation {
    constructor() {
        this.channels = []
        this.isInstrumented = false
    }

    cancelInstrumentUndici() {
        if (!this.isInstrumented) {
            return
        }
        this.isInstrumented = false

        this.channels.forEach(({ name, onMessage }) => {
            diagnosticsChannel.unsubscribe(name, onMessage)
        })
        this.channels = []
    }

    instrument(agent) {
        if (this.isInstrumented) {
            return
        }
        this.isInstrumented = true

        // https://github.com/nodejs/undici/blob/main/docs/docs/api/DiagnosticsChannel.md
        this.subscribeDiagnosticsChannel('undici:request:create', ({ request }) => {
            if (request.method === 'CONNECT') {
                return
            }

            const traceContext = agent.getTraceContext()
            const trace = traceContext.currentTraceObject()
            if (!trace) {
                return
            }

            const clientRequest = new UndiciClientRequest(request)
            const headerWriter = new OutgoingClientRequestHeaderWriter(clientRequest)
            if (!trace.canSampled()) {
                headerWriter.writeSampledHeaderFalse()
                return
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
            request[childTraceContextSymbol] = { childTraceBuilder, recorder }
        })

        // This message is published after the response headers have been received.
        this.subscribeDiagnosticsChannel('undici:request:headers', ({ request, response }) => {
            const { childTraceBuilder, recorder } = request[childTraceContextSymbol] ?? {}
            if (!childTraceBuilder || !recorder) {
                return
            }
            recorder.recordAttribute(annotationKey.HTTP_STATUS_CODE, response.statusCode)
        })

        // This message is published after the response body and trailers have been received, i.e. the response has been completed.
        this.subscribeDiagnosticsChannel('undici:request:trailers', ({ request }) => {
            const { childTraceBuilder, recorder } = request[childTraceContextSymbol] ?? {}
            if (!childTraceBuilder || !recorder) {
                return
            }
            childTraceBuilder.traceBlockEnd(recorder)
            childTraceBuilder.close()
        })
        this.subscribeDiagnosticsChannel('undici:request:error', ({ request, error}) => {
            const { childTraceBuilder, recorder } = request[childTraceContextSymbol] ?? {}
            if (!childTraceBuilder || !recorder) {
                return
            }
            recorder.recordException(error)
            childTraceBuilder.traceBlockEnd(recorder)
            childTraceBuilder.close()
        })
    }

    subscribeDiagnosticsChannel(name, onMessage) {
        const channel = diagnosticsChannel.channel(name)
        diagnosticsChannel.subscribe(name, onMessage)

        if (channel.hasSubscribers) {
            this.channels.push({ name, onMessage, channel })
        }
    }
}

const undiciInstrumentation = new UndiciInstrumentation()

module.exports = function (agent, version, undici) {
    if (semver.lt(version, '4.7.1')) {
        if (log.isDebug()) {
            log.debug('undici version %s not supported - aborting...', version)
        }
        return undici
    }

    undiciInstrumentation.instrument(agent)
}
module.exports.undiciHook = undiciInstrumentation