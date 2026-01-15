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
            const method = ctx.method
            let builder
            if (typeof method === 'string') {
                builder = new MethodDescriptorBuilder(method.toLowerCase()).setClassName('Router')
            } else {
                builder = new MethodDescriptorBuilder('route').setClassName('Router')
            }
            const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
            const trace = localStorage.getStore()
            let spanEventRecorder = null
            let result
            try {
                if (trace) {
                    spanEventRecorder = trace.traceBlockBegin()
                    spanEventRecorder.recordServiceType(serviceType)
                    if (methodDescriptor) {
                        spanEventRecorder.recordApi(methodDescriptor, [path])
                    }

                    const config = traceContext.getConfig()
                    const spanRecorder = trace.getSpanRecorder()
                    if (config.isUriStatsEnabled()) {
                        spanRecorder.recordUriTemplate(path)
                    }
                    if (config.isUriStatsHttpMethodEnabled()) {
                        spanRecorder.recordUriHttpMethod(method)
                    }
                }
                result = await fn.apply(this, arguments)
            } catch (e) {
                if (!e._pinpointCheck) {
                    e._pinpointCheck = true
                    if (spanEventRecorder) {
                        spanEventRecorder.recordException(e, true)
                    }
                }
                throw e
            } finally {
                if (trace && spanEventRecorder) {
                    trace.traceBlockEnd(spanEventRecorder)
                }
            }
            return result
        }
    }
}

module.exports = KoaRegisterInterceptor