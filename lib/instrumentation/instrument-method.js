/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const apiMetaService = require('../context/api-meta-service')
const IdGenerator = require('../context/id-generator')
const { callSite } = require('./call-stack')
const InstrumentMethodContext = require('./instrument-method-context')
const config = require('../config')
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

        const target = this.target
        shimmer.wrap(this.target, this.method, function (original) {
            return function () {
                let builder
                const conf = config.getConfig()
                if (conf && conf.traceLocationAndFileNameOfCallSite) {
                    builder = callSite(interceptor.methodDescriptorBuilder)
                } else {
                    builder = interceptor.methodDescriptorBuilder
                }

                const context = new InstrumentMethodContext(builder)
                if (typeof interceptor.prepareBeforeTrace === 'function') {
                    interceptor.prepareBeforeTrace(target, arguments, this, context)
                }
                
                const trace = localStorage.getStore()
                let recorder
                if (trace) {
                    recorder = trace.traceBlockBegin()
                    
                    if (interceptor.serviceType) {
                        recorder.recordServiceType(interceptor.serviceType)
                    }

                    const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
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
                        if (trace && recorder && typeof recorder.recordNextAsyncId === 'function') {
                            const asyncId = recorder.recordNextAsyncId()
                            asyncTrace = TraceBuilder.valueOfTrace(trace).buildAsyncTrace(asyncId)
                        }
                        
                        if (!asyncTrace) {
                            return callback.apply(this, arguments)
                        }

                        localStorage.run(asyncTrace, () => {
                            const asyncEventRecorder = asyncTrace.traceAsyncBegin()
                            const nextSpanId = IdGenerator.next
                            asyncEventRecorder.recordNextSpanId(nextSpanId)
                            
                            if (interceptor.serviceType) {
                                asyncEventRecorder.recordServiceType(interceptor.serviceType)
                            }
    
                            const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
                            if (methodDescriptor) {
                                asyncEventRecorder.recordApi(methodDescriptor)
                            }
    
                            if (typeof interceptor.doInBeforeAsyncTrace === 'function') {
                                interceptor.doInBeforeAsyncTrace(asyncEventRecorder, target, arguments)
                            }
    
                            const returnedValue = callback.apply(this, arguments)
    
                            if (typeof interceptor.prepareAfterAsyncTrace === 'function') {
                                interceptor.prepareAfterAsyncTrace(target, arguments, returnedValue)
                            }
    
                            if (asyncEventRecorder && typeof interceptor.doInAfterAsyncTrace === 'function') {
                                interceptor.doInAfterAsyncTrace(asyncEventRecorder, target, arguments, returnedValue)
                            }

                            asyncTrace.traceAsyncEnd(asyncEventRecorder)
                            
                            return returnedValue
                        })
                    }
                }

                var returned = original.apply(this, arguments)

                if (typeof interceptor.prepareAfterTrace === 'function') {
                    interceptor.prepareAfterTrace(target, arguments, returned, this, context)
                }

                if (recorder && typeof interceptor.doInAfterTrace === 'function') {
                    interceptor.doInAfterTrace(recorder, target, arguments, returned)
                }

                if (trace) {
                    trace.traceBlockEnd(recorder)
                }
                return returned
            }
        })
    }
}

module.exports = InstrumentMethod