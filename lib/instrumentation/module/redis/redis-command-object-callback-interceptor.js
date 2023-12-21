/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const CallbackInterceptorRunner = require("../../callback-interceptor-runner")

class RedisCommandObjectCallbackInterceptor {
    makeHookCallbackFunction(trace, localAsyncId, hookFunctionArguments) {
        return function () {
            return new CallbackInterceptorRunner(trace, localAsyncId, hookFunctionArguments).run(null, this, arguments)
        }
    }
}

module.exports = RedisCommandObjectCallbackInterceptor