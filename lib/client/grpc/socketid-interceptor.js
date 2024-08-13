/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall
const SequenceGenerator = require('../../context/sequence-generator')

const pingIdGenerator = new SequenceGenerator()
const socketIdInterceptor = function (options, nextCall) {
    return new InterceptingCall(nextCall(options), {
        start: function (metadata, listener, next) {
            metadata.add('socketid', `${pingIdGenerator.next}`)
            next(metadata, listener, next)
        }
    })
}

module.exports = socketIdInterceptor