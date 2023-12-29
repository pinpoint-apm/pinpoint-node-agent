/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const localStorage = require('./context/local-storage')
const TraceBuilder = require('./context/trace-builder')

class CallbackInterceptorRunner {
    constructor(trace, localAsyncId, hookFunctionArguments) {
        this.trace = trace
        this.localAsyncId = localAsyncId
        this.original = hookFunctionArguments.getOriginal()
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
    
            const asyncTrace = TraceBuilder.valueOfTrace(this.trace).buildAsyncTrace(this.localAsyncId)
            return localStorage.run(asyncTrace, () => {
                const result = this.original.apply(thisArg, argsArray)
                asyncTrace.close()
                return result
            })
        })
    }
}

module.exports = CallbackInterceptorRunner