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
const TraceBuilder = require('./context/trace-builder')
const localStorage = require('./context/local-storage')

// ref: SpanEventSimpleAroundInterceptorForPlugin.java
class InstrumentMethod {
    constructor(target, method) {
        this.target = target
        this.method = method
    }

    static make(target, method) {
        return new InstrumentMethod(target, method)
    }

    addScopedInterceptor(interceptor) {
        if (!this.target) {
            return
        }

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

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

                if (arguments.length > 0 && typeof interceptor.callbackIndexOf === 'function' && typeof interceptor.callbackIndexOf(arguments) === 'number') {
                    recorder.recordNextAsyncId()
                    const callbackIndex = interceptor.callbackIndexOf(arguments)
                    const callback = arguments[callbackIndex]
                    arguments[callbackIndex] = function () {
                        if (typeof interceptor.prepareBeforeAsyncTrace === 'function') {
                            interceptor.prepareBeforeAsyncTrace(this, arguments)
                        }

                        const asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(recorder.getLocalAsyncId())                        
                        return localStorage.run(asyncTrace, () => {
                            const returnedValue = callback.apply(this, arguments)
                            asyncTrace.close()
                            return returnedValue
                        })
                    }
                }

                var returned = original.apply(this, arguments)

                if (typeof interceptor.prepareAfterTrace === 'function') {
                    interceptor.prepareAfterTrace(this, arguments, returned, context)
                }

                if (recorder && typeof interceptor.doInAfterTrace === 'function') {
                    interceptor.doInAfterTrace(recorder, this, arguments, returned)
                }

                if (trace) {
                    trace.traceBlockEnd(recorder)
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

        if (!callerSpanEventRecorder || typeof callerSpanEventRecorder.recordNextAsyncId !== 'function') {
            return
        }
        
        shimmer.wrap(this.target, this.method, function (original) {
            return function () {
                const trace = localStorage.getStore()
                if (!trace) {
                    return original.apply(this, arguments)
                }
                callerSpanEventRecorder.recordNextAsyncId()

                if (typeof interceptor.prepareBeforeAsyncTrace === 'function') {
                    interceptor.prepareBeforeAsyncTrace(this, arguments)
                }

                const asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(callerSpanEventRecorder.getLocalAsyncId())
                return localStorage.run(asyncTrace, () => {
                    const returnedValue = original.apply(this, arguments)
                    asyncTrace.close()
                    return returnedValue
                })           
            }
        })
    }
}

module.exports = InstrumentMethod