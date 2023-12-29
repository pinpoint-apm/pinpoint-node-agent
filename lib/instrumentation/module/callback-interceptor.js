/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const CallbackInterceptorRunner = require('../callback-interceptor-runner')

class CallbackInterceptor {
    makeHookCallbackFunction(trace, localAsyncId, hookFunctionArguments) {
        return function () {
            return new CallbackInterceptorRunner(trace, localAsyncId, hookFunctionArguments).run(null, this, arguments)
        }
    }
}

module.exports = CallbackInterceptor