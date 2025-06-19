/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const serviceType = require('../redis/redis-service-type')
const { addressStringOf } = require('../../../utils/convert-utils')
const InstrumentArrowFunction = require('../../instrument-arrow-function')
const endTraceSymbol = Symbol('ioredis-end-trace')

class IoredisSendCommandInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = MethodDescriptorBuilder.makeRuntimeDetectionMethodDescriptorBuilder()
            .setClassName('Redis')
        this.serviceType = serviceType
    }

    makeFunctionNameDetectedMethodDescriptorBuilder(thisArg, args) {
        if (!args || args.length < 1 || typeof args[0].name !== 'string') {
            return this.methodDescriptorBuilder
        }
        return this.methodDescriptorBuilder.makeCloneOf(args[0].name)
    }

    doInBeforeTrace(recorder, target, args) {
        if (!args || args.length < 1 || typeof args[0].name !== 'string') {
            return
        }
        
        recorder.recordDestinationId('Redis')
        if (target.connector && target.connector.options) {
            recorder.recordEndPoint(addressStringOf(target.connector.options.host, target.connector.options.port))
        }
        
        recorder.recordServiceType(this.serviceType)
    }
}

module.exports = IoredisSendCommandInterceptor