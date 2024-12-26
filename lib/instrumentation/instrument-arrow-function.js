/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const HookFunctionArguments = require('./hook-function-arguments')
const localStorage = require('./context/local-storage')
// const log = require('../utils/logger')

// ref: SpanEventSimpleAroundInterceptorForPlugin.java
class InstrumentArrowFunction {
    constructor(target, method, traceContext) {
        this.target = target
        this.method = method
        this.traceContext = traceContext
    }

    static make(target, method, traceContext) {
        return new InstrumentArrowFunction(target, method, traceContext)
    }

    addScopedInterceptor(interceptor) {
        if (!this.target) {
            return
        }

        if (!this.method || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        const target = this.target
        const method = this.method
        shimmer.wrap(target, method, function (original) {
            return interceptor.makeHookFunction(new HookFunctionArguments(target, method, original))
        })
    }

    addChildTraceInterceptor(callerSpanEventRecorder) {
        if (!this.target) {
            return
        }

        if (!this.method || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        if (!callerSpanEventRecorder || typeof callerSpanEventRecorder.getNextAsyncId !== 'function') {
            return
        }

        const target = this.target
        const method = this.method
        const traceContext = this.traceContext
        const trace = localStorage.getStore()
        const asyncId = callerSpanEventRecorder.getNextAsyncId()
        shimmer.wrap(target, method, function (original) {
            return function () {
                if (!trace) {
                    return original.apply(this, arguments)
                }
                if (!asyncId) {
                    return original.apply(this, arguments)
                }

                // if (log.isInfo()) {
                //     if (typeof method !== 'symbol') {
                //         log.info(`target: ${JSON.stringify(target)}, method: ${method}, original: ${original} InstrumentArrowFunction.addChildTraceInterceptor`)
                //     } else {
                //         log.info(`target: ${JSON.stringify(target)}, symbol method, original: ${original} InstrumentArrowFunction.addChildTraceInterceptor`)
                //     }
                // }
                const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
                return localStorage.run(childTraceBuilder, () => {
                    const result = original.apply(this, arguments)
                    childTraceBuilder.close()
                    return result
                })
            }
        })
    }
}

module.exports = InstrumentArrowFunction