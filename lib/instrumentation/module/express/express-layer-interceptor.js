/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('../../context/local-storage')
const util = require('util')
const errorReportedSymbol = Symbol('PinpointErrorReported')
const apiMetaService = require('../../../context/api-meta-service')
const serviceType = require('./express-service-type')
const log = require('../../../utils/log/logger')

class ExpressLayerInterceptor {
    constructor(traceContext, methodDescriptorBuilder) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = methodDescriptorBuilder
    }

    makeHookFunction(hookFunctionArguments) {
        const interceptor = this
        const original = hookFunctionArguments.getOriginal()
        if (original.length == 4) {
            return function wrapped(err, req, res, next) {
                const trace = localStorage.getStore()
                if (!trace) {
                    return original.apply(this, arguments)
                }

                let recorder
                try {
                    recorder = trace.traceBlockBegin()
                    recorder.recordApi(apiMetaService.cacheApiWithBuilder(interceptor.methodDescriptorBuilder))
                    recorder.recordServiceType(serviceType)
                    if (shouldReport(err)) {
                        recorder.recordException(err, true)
                    }
                } catch (error) {
                    log.debug('Fail to record the Express error handler', error)
                }
                return interceptor.runHandler(trace, recorder, original, this, arguments, 3)
            }
        }
        return function wrapped(req, res, next) {
            const trace = localStorage.getStore()
            if (!trace) {
                return original.apply(this, arguments)
            }

            let recorder
            try {
                recorder = trace.traceBlockBegin()
                recorder.recordApi(apiMetaService.cacheApiWithBuilder(interceptor.requestMethodDescriptorBuilder(req)))
                recorder.recordServiceType(serviceType)
            } catch (error) {
                log.debug('Fail to record the Express layer', error)
            }
            const result = interceptor.runHandler(trace, recorder, original, this, arguments, 2)
            try {
                const spanRecorder = trace.getSpanRecorder()
                spanRecorder.recordUriTemplate(req.route?.path)
                spanRecorder.recordUriHttpMethod(req.method)
            } catch (error) {
                log.debug('Fail to record the URI template of the Express layer', error)
            }
            return result
        }
    }

    requestMethodDescriptorBuilder(req) {
        if (this.methodDescriptorBuilder.getFunctionName() === 'route' && typeof req.method === 'string') {
            return this.methodDescriptorBuilder.makeCloneOf(req.method.toLowerCase())
        }
        return this.methodDescriptorBuilder
    }

    // The handler runs in its own Asynchronous Invocation, so the calls it makes after an await keep its localAsyncId.
    // next() continues the request in the request trace, so the next layer is a sibling of this one.
    runHandler(trace, recorder, handler, thisArg, args, nextIndex) {
        if (!recorder) {
            return handler.apply(thisArg, args)
        }

        let ended = false
        const traceLayerEnd = () => {
            if (ended) {
                return
            }
            ended = true
            try {
                trace.traceBlockEnd(recorder)
            } catch (error) {
                log.debug('Fail to end the Express layer', error)
            }
        }

        const next = args[nextIndex]
        if (typeof next === 'function') {
            args[nextIndex] = function () {
                traceLayerEnd()
                return localStorage.run(trace, () => next.apply(this, arguments))
            }
        }

        let childTraceBuilder
        try {
            childTraceBuilder = this.traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), recorder.getNextAsyncId().nextLocalAsyncId2())
        } catch (error) {
            log.debug('Fail to make the Asynchronous Invocation of the Express layer', error)
        }
        if (!childTraceBuilder) {
            try {
                return handler.apply(thisArg, args)
            } finally {
                traceLayerEnd()
            }
        }

        try {
            return localStorage.run(childTraceBuilder, () => handler.apply(thisArg, args))
        } finally {
            try {
                childTraceBuilder.close()
            } catch (error) {
                log.debug('Fail to close the Asynchronous Invocation of the Express layer', error)
            }
            traceLayerEnd()
        }
    }
}

function shouldReport(error) {
    if (typeof error === 'string') {
        return true
    }
    if (util.types.isNativeError(error) && !error[errorReportedSymbol]) {
        error[errorReportedSymbol] = true
        return true
    }
    return false
}

module.exports = ExpressLayerInterceptor
