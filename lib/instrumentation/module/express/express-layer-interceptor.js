/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('../../context/local-storage')
const util = require('util')
const InterceptorRunner = require('../../interceptor-runner')
const errorReportedSymbol = Symbol('PinpointErrorReported')
const apiMetaService = require('../../../context/api-meta-service')
const serviceType = require('./express-service-type')

class ExpressLayerInterceptor {
    constructor(methodDescriptorBuilder) {
        this.methodDescriptorBuilder = methodDescriptorBuilder
    }

    makeHookFunction(hookFunctionArguments) {
        const interceptor = this
        const original = hookFunctionArguments.getOriginal()
        const methodDescriptorBuilder = this.methodDescriptorBuilder
        if (original.length == 4) {
            return function wrapped(err, req, res, next) {
                return new InterceptorRunner(interceptor, hookFunctionArguments, wrapped).run({
                    doInBeforeTrace: (spanEventRecorder) => {
                        if (shouldReport(err)) {
                            spanEventRecorder.recordException(err, true)
                        }
                    },
                    doInAfterTrace: (recorder) => {
                        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
                        recorder.recordApi(methodDescriptor)
                        recorder.recordServiceType(serviceType)
                    }
                }, this, arguments)
            }
        }
        return function wrapped(req, res, next) {
            return new InterceptorRunner(interceptor, hookFunctionArguments, wrapped).run({
                doInBeforeTrace: (spanEventRecorder) => {
                    const layer = hookFunctionArguments.getTarget()
                    if (!layer.route && typeof next === 'function') {
                        arguments[2] = function () {
                            const trace = localStorage.getStore()
                            if (trace) {
                                trace.traceBlockEnd(spanEventRecorder)
                            }
                            return next.apply(this, arguments)
                        }
                    }
                },
                doInAfterTrace: (recorder) => {
                    let builder = methodDescriptorBuilder
                    if (methodDescriptorBuilder.getFunctionName() === 'route' && typeof req.method === 'string') {
                        builder = methodDescriptorBuilder.makeCloneOf(req.method.toLowerCase())
                    }
                    const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
                    recorder.recordApi(methodDescriptor)
                    recorder.recordServiceType(serviceType)
                }
            }, this, arguments)
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