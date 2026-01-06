/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const localStorage = require('./context/local-storage')
const log = require('../utils/log/logger')

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
                if (typeof interceptor.prepareBeforeTrace === 'function') {
                    interceptor.prepareBeforeTrace(this, arguments)
                }

                const trace = localStorage.getStore()
                let recorder
                try {
                    if (trace) {
                        recorder = trace.traceBlockBegin()

                        if (typeof interceptor.doInBeforeTrace === 'function') {
                            interceptor.doInBeforeTrace(recorder, this, arguments)
                        }
                    }

                    if (recorder && arguments.length > 0 && typeof interceptor.callbackIndexOf === 'function' && typeof interceptor.callbackIndexOf(arguments) === 'number') {
                        const asyncId = recorder.getNextAsyncId()
                        const callbackIndex = interceptor.callbackIndexOf(arguments)
                        shimmer.wrap(arguments, callbackIndex, function (original) {
                            return function () {
                                try {
                                    interceptor.prepareBeforeAsyncTrace?.(this, arguments)
                                } catch (error) {
                                    log.error(`arguments: ${error}`)
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
                } catch (error) {
                    // TODO: INTERNAL ERROR logger
                    log.error(error)
                }

                var returned = original.apply(this, arguments)

                try {
                    interceptor.prepareAfterTrace?.(this, arguments, returned)

                    if (!recorder) {
                        return returned
                    }
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
}

module.exports = InstrumentMethod