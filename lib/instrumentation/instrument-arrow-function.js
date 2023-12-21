/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const shimmer = require('@pinpoint-apm/shimmer')
const HookFunctionArguments = require('./hook-function-arguments')
const localStorage = require('./context/local-storage')

// ref: SpanEventSimpleAroundInterceptorForPlugin.java
class InstrumentArrowFunction {
    constructor(target, method) {
        this.target = target
        this.method = method
    }

    static make(target, method) {
        return new InstrumentArrowFunction(target, method)
    }

    addScopedInterceptor(interceptor) {
        if (!this.target) {
            return
        }

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
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

        if (!this.method || typeof this.method !== 'string' || !this.target[this.method] || typeof this.target[this.method] !== 'function') {
            return
        }

        if (!callerSpanEventRecorder || typeof callerSpanEventRecorder.recordNextAsyncId !== 'function') {
            return
        }
        callerSpanEventRecorder.recordNextAsyncId()

        const target = this.target
        const method = this.method
        const trace = localStorage.getStore()
        shimmer.wrap(target, method, function (original) {
            return interceptor.makeHookCallbackFunction(trace, callerSpanEventRecorder.getLocalAsyncId(), new HookFunctionArguments(target, method, original))
        })
    }
}

module.exports = InstrumentArrowFunction