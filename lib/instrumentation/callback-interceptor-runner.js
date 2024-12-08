/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('./context/local-storage')

class CallbackInterceptorRunner {
    constructor(trace, localAsyncId, hookFunctionArguments, traceContext) {
        this.trace = trace
        this.localAsyncId = localAsyncId
        this.original = hookFunctionArguments.getOriginal()
        this.traceContext = traceContext
    }

    run(wrapper, thisArg, argsArray) {
        return localStorage.run(this.trace, () => {
            if (!this.trace) {
                return this.original.apply(thisArg, argsArray)
            }

            if (!wrapper) {
                wrapper = {}
            }

            if (typeof wrapper.prepareBeforeTrace === 'function') {
                wrapper.prepareBeforeTrace()
            }

            const childTraceBuilder = this.traceContext.continueAsyncContextTraceObject(this.trace.getTraceRoot(), this.localAsyncId.nextLocalAsyncId2())
            return localStorage.run(childTraceBuilder, () => {
                const result = this.original.apply(thisArg, argsArray)
                childTraceBuilder.close()
                return result
            })
        })
    }
}

module.exports = CallbackInterceptorRunner