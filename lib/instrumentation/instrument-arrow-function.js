/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const HookFunctionArguments = require('./hook-function-arguments')
const localStorage = require('./context/local-storage')

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

    addCallbackInterceptor(interceptor, callerSpanEventRecorder) {
        if (!this.target) {
            return
        }

        if (!this.method || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        if (!callerSpanEventRecorder || typeof callerSpanEventRecorder.getNextAsyncId !== 'function') {
            return
        }
        const asyncId = callerSpanEventRecorder.getNextAsyncId()

        const target = this.target
        const method = this.method
        const trace = localStorage.getStore()
        const traceContext = this.traceContext
        shimmer.wrap(target, method, function (original) {
            return interceptor.makeHookCallbackFunction(trace, asyncId, new HookFunctionArguments(target, method, original), traceContext)
        })
    }
}

module.exports = InstrumentArrowFunction