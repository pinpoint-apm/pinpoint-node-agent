/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const apiMetaService = require('../../../context/api-meta-service')
const MethodDescriptorBuilder2 = require('../../../context/method-descriptor-builder2')
const { Builder } = require('../../../utils/log/logger2')
const serviceType = require('./koa-service-type')

class KoaRegisterInterceptor {
    constructor() {
        this.methodDescriptorBuilder = MethodDescriptorBuilder2.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('koa')
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
            const methodDescriptor = apiMetaService.cacheApiWithBuilder(context.getMethodDescriptorBuilder())
            const trace = context.currentTraceObject()
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