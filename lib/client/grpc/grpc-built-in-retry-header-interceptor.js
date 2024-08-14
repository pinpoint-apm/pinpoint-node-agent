/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall

const grpcBuiltInRetryHeaderInterceptor = function (options, nextCall) {
    return new InterceptingCall(nextCall(options), {
        start: function (metadata, listener, next) {
            metadata.add('grpc.built-in.retry', 'true')
            next(metadata, listener, next)
        },
    })
}

module.exports = grpcBuiltInRetryHeaderInterceptor