/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const apiMetaService = require('../context/api-meta-service')
const { callSite } = require('./call-stack')
const InstrumentMethodContext = require('./instrument-method-context')
const localStorage = require('./context/local-storage')
const log = require('../utils/logger')

// ref: SpanEventSimpleAroundInterceptorForPlugin.java
class InstrumentMethod {
    constructor(target, method, traceContext) {
        this.target = target
        this.method = method
        this.traceContext = traceContext
    }

    static make(target, method, traceContext) {
        return new InstrumentMethod(target, method, traceContext)
    }

    addScopedInterceptor(interceptor) {
        if (!this.target) {
            return
        }

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        const traceContext = this.traceContext
        shimmer.wrap(this.target, this.method, function (original) {
            return function () {
                let builder
                if (interceptor.methodDescriptorBuilder.shouldCallSiteFileNameAndLineNumber()) {
                    builder = callSite(interceptor.methodDescriptorBuilder)
                } else if (interceptor.methodDescriptorBuilder.isRuntimeDetection() && typeof interceptor.makeFunctionNameDetectedMethodDescriptorBuilder === 'function') {
                    builder = interceptor.makeFunctionNameDetectedMethodDescriptorBuilder(this, arguments)
                } else {
                    builder = interceptor.methodDescriptorBuilder
                }

                const context = new InstrumentMethodContext(builder)
                if (typeof interceptor.prepareBeforeTrace === 'function') {
                    interceptor.prepareBeforeTrace(this, arguments, context)
                }

                const trace = localStorage.getStore()
                let recorder
                try {
                    if (trace && builder.isDetectedFunctionName()) {
                        recorder = trace.traceBlockBegin()

                        if (interceptor.serviceType) {
                            recorder.recordServiceType(interceptor.serviceType)
                        }

                        const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
                        if (methodDescriptor) {
                            recorder.recordApi(methodDescriptor)
                        }
                        if (typeof interceptor.doInBeforeTrace === 'function') {
                            interceptor.doInBeforeTrace(recorder, this, arguments)
                        }
                    }

                    if (recorder && arguments.length > 0 && typeof interceptor.callbackIndexOf === 'function' && typeof interceptor.callbackIndexOf(arguments) === 'number') {
                        const asyncId = recorder.getNextAsyncId()
                        const callbackIndex = interceptor.callbackIndexOf(arguments)
                        const callback = arguments[callbackIndex]
                        arguments[callbackIndex] = function () {
                            try {
                                interceptor.prepareBeforeAsyncTrace?.(this, arguments)
                            } catch (error) {
                                log.error(`arguments: ${error}`)
                            }
                            const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
                            return localStorage.run(childTraceBuilder, () => {
                                const returnedValue = callback.apply(this, arguments)
                                childTraceBuilder?.close()
                                return returnedValue
                            })
                        }
                    }
                } catch (error) {
                    // TODO: INTERNAL ERROR logger
                    log.error(error)
                }

                var returned = original.apply(this, arguments)

                try {
                    interceptor.prepareAfterTrace?.(this, arguments, returned, context)
                    interceptor.doInAfterTrace?.(recorder, this, arguments, returned)
                    trace?.traceBlockEnd(recorder)
                } catch (error) {
                    // TODO: INTERNAL ERROR logger
                    log.error(error)
                }
                return returned
            }
        })
    }

    addCallbackInterceptor(interceptor, callerSpanEventRecorder) {
        if (!this.target) {
            return
        }

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        if (!callerSpanEventRecorder || typeof callerSpanEventRecorder.getNextAsyncId !== 'function') {
            return
        }

        const traceContext = this.traceContext
        shimmer.wrap(this.target, this.method, function (original) {
            return function () {
                const trace = localStorage.getStore()
                if (!trace) {
                    return original.apply(this, arguments)
                }
                const asyncId = callerSpanEventRecorder.getNextAsyncId()

                try {
                    interceptor.prepareBeforeAsyncTrace?.(this, arguments)
                } catch (error) {
                    log.error(`addCallbackInterceptor: ${error}`)
                }

                const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
                return localStorage.run(childTraceBuilder, () => {
                    const returnedValue = original.apply(this, arguments)
                    childTraceBuilder?.close()
                    return returnedValue
                })
            }
        })
    }
}

module.exports = InstrumentMethod