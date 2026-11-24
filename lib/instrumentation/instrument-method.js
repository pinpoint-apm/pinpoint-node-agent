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
                        const targetThis = this
                        shimmer.wrap(arguments, callbackIndex, function (original) {
                            return function () {
                                try {
                                    interceptor.prepareBeforeAsyncTrace?.(targetThis, arguments)
                                } catch (error) {
                                    log.error(`arguments: ${error}`)
                                }
                                const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
                                try {
                                    const error = arguments[0]
                                    if (isError(error)) {
                                        childTraceBuilder.getAsyncSpanEventRecorder().recordException(error, true)
                                    }
                                } catch (error) {
                                    log.error(`Fail to record the callback error: ${error}`)
                                }
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

// Node.js err-first callback convention: the first argument is the Error when the call fails,
// and null or undefined when it succeeds.
//   mysql2: onResult(err) / onResult(null, rows, fields)
//   pg:     callback(err) / callback(null, result)
//
// Most calls succeed, so null and undefined return before any other check.
// util.types.isNativeError is deprecated in favor of Error.isError (DEP0197),
// but Error.isError does not exist in Node.js 22 and is slower.
// instanceof Error gives the same result for the errors these libraries create.
//   ns per call, null input, Node.js 24 (median of 5 runs, 2e7 calls each)
//   this function 2.3 | util.types.isNativeError 2.9 | Error.isError 6.4
function isError(value) {
    if (value === null || value === undefined) {
        return false
    }
    if (typeof value.name !== 'string') {
        return false
    }
    return value instanceof Error
}

module.exports = InstrumentMethod