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

class ExpressLayerInterceptor {
    constructor(methodDescriptorBuilder) {
        this.methodDescriptorBuilder = methodDescriptorBuilder
        this.serviceType = require('./express-service-type')
    }

    makeHookFunction(hookFunctionArguments) {
        const interceptor = this
        const original = hookFunctionArguments.getOriginal()
        if (original.length == 4) {
            return function wrapped(err, req, res, next) {
                return new InterceptorRunner(interceptor, hookFunctionArguments, wrapped).run({
                    makeMethodDescriptorBuilder: (builder) => {
                        if (!req || typeof req.method !== 'string' || !builder.isRuntimeDetection()) {
                            return builder
                        }
                        return builder.makeCloneOf(req.method.toLowerCase())
                    },
                    doInBeforeTrace: (spanEventRecorder) => {
                        if (shouldReport(err)) {
                            spanEventRecorder.recordException(err, true)
                        }
                    }
                }, this, arguments)
            }
        }
        return function wrapped(req, res, next) {
            return new InterceptorRunner(interceptor, hookFunctionArguments, wrapped).run({
                makeMethodDescriptorBuilder: (builder) => {
                    if (!req || typeof req.method !== 'string' || !builder.isRuntimeDetection()) {
                        return builder
                    }
                    return builder.makeCloneOf(req.method.toLowerCase())
                },
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