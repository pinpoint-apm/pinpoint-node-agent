/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const apiMetaService = require('../../../context/api-meta-service')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const serviceType = require('./koa-service-type')
const localStorage = require('../../../instrumentation/context/local-storage')
const log = require('../../../utils/log/logger')

class KoaRegisterInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    prepareAfterTrace(router, args, layer) {
        if (!layer) {
            return
        }

        if (!Array.isArray(layer.stack) || layer.stack.length < 1) {
            return
        }

        const handlerIndex = layer.stack.length - 1
        const fn = layer.stack[handlerIndex]
        if (typeof fn !== 'function') {
            return
        }

        let path
        if (args && args.length > 0 && typeof args[0] === 'string') {
            path = args[0]
        }

        const traceContext = this.traceContext
        layer.stack[handlerIndex] = async function (ctx, next) {
            const trace = localStorage.getStore()
            let spanEventRecorder
            if (trace) {
                try {
                    const method = ctx.method
                    const builder = typeof method === 'string'
                        ? new MethodDescriptorBuilder(method.toLowerCase()).setClassName('Router')
                        : new MethodDescriptorBuilder('route').setClassName('Router')
                    const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
                    spanEventRecorder = trace.traceBlockBegin()
                    spanEventRecorder.recordServiceType(serviceType)
                    if (methodDescriptor) {
                        spanEventRecorder.recordApi(methodDescriptor, [path])
                    }

                    const spanRecorder = trace.getSpanRecorder()
                    spanRecorder.recordUriTemplate(path)
                    spanRecorder.recordUriHttpMethod(method)
                } catch (error) {
                    log.debug('Fail to record the Koa route', error)
                }
            }

            try {
                return await runHandler(traceContext, trace, spanEventRecorder, fn, this, arguments)
            } catch (e) {
                try {
                    if (!e._pinpointCheck) {
                        e._pinpointCheck = true
                        if (spanEventRecorder) {
                            spanEventRecorder.recordException(e, true)
                        }
                    }
                } catch (error) {
                    log.debug('Fail to record the exception of the Koa route', error)
                }
                throw e
            } finally {
                if (spanEventRecorder) {
                    try {
                        trace.traceBlockEnd(spanEventRecorder)
                    } catch (error) {
                        log.debug('Fail to end the Koa route', error)
                    }
                }
            }
        }
    }
}

// The handler runs in its own Asynchronous Invocation, so the calls it makes after an await keep its localAsyncId.
// next() continues the request in the request trace.
function runHandler(traceContext, trace, spanEventRecorder, handler, thisArg, args) {
    if (!spanEventRecorder) {
        return handler.apply(thisArg, args)
    }

    const next = args[1]
    if (typeof next === 'function') {
        args[1] = function () {
            return localStorage.run(trace, () => next.apply(this, arguments))
        }
    }

    let childTraceBuilder
    try {
        childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), spanEventRecorder.getNextAsyncId().nextLocalAsyncId2())
    } catch (error) {
        log.debug('Fail to make the Asynchronous Invocation of the Koa route', error)
        return handler.apply(thisArg, args)
    }

    try {
        return localStorage.run(childTraceBuilder, () => handler.apply(thisArg, args))
    } finally {
        try {
            childTraceBuilder.close()
        } catch (error) {
            log.debug('Fail to close the Asynchronous Invocation of the Koa route', error)
        }
    }
}

module.exports = KoaRegisterInterceptor