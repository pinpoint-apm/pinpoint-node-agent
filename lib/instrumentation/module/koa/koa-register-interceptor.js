/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const apiMetaService = require('../../../context/api-meta-service')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const serviceType = require('./koa-service-type')
const localStorage = require('../../../instrumentation/context/local-storage')

class KoaRegisterInterceptor {
    constructor() {
        this.methodDescriptorBuilder = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('Router')
            .setFileNameIndex(3)
    }

    prepareAfterTrace(router, args, layer, wrapFunctionThis, context) {
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

        layer.stack[handlerIndex] = async function (ctx, next) {
            const method = ctx.method

            let builder = context.getMethodDescriptorBuilder()
            if (builder && typeof builder.isRuntimeDetection === 'function' && builder.isRuntimeDetection() && typeof method === 'string') {
                builder = builder.makeCloneOf(method.toLowerCase())
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
                }
                result = await fn.apply(this, arguments)
            } catch (e) {
                if (!e._pinpointCheck) {
                    e._pinpointCheck = true
                    spanEventRecorder.recordServiceType(serviceType)
                    if (methodDescriptor) {
                        spanEventRecorder.recordApi(methodDescriptor, [path])
                    }
                    spanEventRecorder.recordException(e, true)
                }
                throw e
            } finally {
                if (trace) {
                    trace.traceBlockEnd(spanEventRecorder)
                }
            }
            return result
        }
    }
}

module.exports = KoaRegisterInterceptor