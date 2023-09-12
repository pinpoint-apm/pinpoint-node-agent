/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('shimmer')
const apiMetaService = require('../context/api-meta-service')
const IdGenerator = require('../context/id-generator')
const { callSite } = require('./call-stack')
const instrumented = Symbol('Pinpoint_instrumented')

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

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function' || this.target[this.method][instrumented]) {
            return
        }

        const traceContext = this.traceContext
        const target = this.target
        const methodDescriptorBuilder = interceptor.methodDescriptorBuilder
        shimmer.wrap(this.target, this.method, function (original) {
            const wrapped = function () {
                const location = callSite(2)
                methodDescriptorBuilder.setLocation(location.location)
                methodDescriptorBuilder.setLineNumber(location.lineNumber)
                methodDescriptorBuilder.setFileName(location.fileName)
                const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)

                if (typeof interceptor.prepareBeforeTrace === 'function') {
                    interceptor.prepareBeforeTrace(target, arguments)
                }

                const trace = traceContext.currentTraceObject()
                let recorder
                if (trace) {
                    recorder = trace.traceBlockBegin()

                    if (interceptor.serviceType) {
                        recorder.recordServiceType(interceptor.serviceType)
                    }

                    if (methodDescriptor) {
                        recorder.recordApi(methodDescriptor)
                    }
                    if (typeof interceptor.doInBeforeTrace === 'function') {
                        interceptor.doInBeforeTrace(recorder, target, arguments)
                    }
                }

                if (arguments.length > 0 && typeof interceptor.callbackIndexOf === 'function' && typeof interceptor.callbackIndexOf(arguments) === 'number') {
                    const callbackIndex = interceptor.callbackIndexOf(arguments)
                    const callback = arguments[callbackIndex]
                    arguments[callbackIndex] = function () {
                        if (typeof interceptor.prepareBeforeAsyncTrace === 'function') {
                            interceptor.prepareBeforeAsyncTrace(target, arguments)
                        }

                        let asyncTrace
                        let asyncEventRecorder
                        if (trace) {
                            asyncTrace = trace.newAsyncTrace(recorder)
                            asyncEventRecorder = asyncTrace.traceAsyncBegin()
                            const nextSpanId = IdGenerator.next
                            asyncEventRecorder.recordNextSpanId(nextSpanId)
                            
                            if (interceptor.serviceType) {
                                asyncEventRecorder.recordServiceType(interceptor.serviceType)
                            }

                            if (methodDescriptor) {
                                asyncEventRecorder.recordApi(methodDescriptor)
                            }

                            if (typeof interceptor.doInBeforeAsyncTrace === 'function') {
                                interceptor.doInBeforeAsyncTrace(asyncEventRecorder, target, arguments)
                            }
                        }
                        const returnedValue = callback.apply(this, arguments)

                        if (asyncTrace) {
                            if (typeof interceptor.prepareAfterAsyncTrace === 'function') {
                                interceptor.prepareAfterAsyncTrace(target, arguments, returnedValue)
                            }

                            if (asyncEventRecorder && typeof interceptor.doInAfterAsyncTrace === 'function') {
                                interceptor.doInAfterAsyncTrace(asyncEventRecorder, target, arguments, returnedValue)
                            }
                            asyncTrace.traceAsyncEnd(asyncEventRecorder)
                        }
                        return returnedValue
                    }
                }

                var returned = original.apply(this, arguments)

                if (typeof interceptor.prepareAfterTrace === 'function') {
                    interceptor.prepareAfterTrace(target, arguments, returned)
                }

                if (recorder && typeof interceptor.doInAfterTrace === 'function') {
                    interceptor.doInAfterTrace(recorder, target, arguments, returned)
                }

                if (trace && recorder) {
                    trace.traceBlockEnd(recorder)
                }
                return returned
            }
            wrapped[instrumented] = true
            return wrapped
        })
    }
}

module.exports = InstrumentMethod