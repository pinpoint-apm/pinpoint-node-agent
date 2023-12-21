/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./redis-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const { addressStringOf } = require('../../../utils/convert-utils')
const InstrumentArrowFunction = require('../../instrument-arrow-function')
const RedisCommandObjectCallbackInterceptor = require('./redis-command-object-callback-interceptor')

class RedisInternalSendCommandInterceptor {
    constructor() {
        this.methodDescriptorBuilder = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('RedisClient')
        this.serviceType = serviceType
    }

    makeFunctionNameDetectedMethodDescriptorBuilder(thisArg, args) {
        if (!args || args.length < 1 || typeof args[0].command !== 'string') {
            return this.methodDescriptorBuilder
        }

        const command = args[0]
        return this.methodDescriptorBuilder.makeCloneOf(command.command)
    }

    doInBeforeTrace(recorder, target, args) {
        if (!args || args.length < 1 || typeof args[0].command !== 'string') {
            return
        }
        recorder.recordDestinationId('Redis')

        if (target.connection_options) {
            recorder.recordEndPoint(addressStringOf(target.connection_options.host, target.connection_options.port))
        }

        const command = args[0]
        InstrumentArrowFunction.make(command, 'callback').addCallbackInterceptor(new RedisCommandObjectCallbackInterceptor(), recorder)
    }
}

module.exports = RedisInternalSendCommandInterceptor