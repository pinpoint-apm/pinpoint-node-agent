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
const apiMetaService = require('../../../context/api-meta-service')

class IoredisSendCommandInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder, target, args) {
        if (!args || args.length < 1 || typeof args[0].name !== 'string') {
            return
        }
        recorder.recordDestinationId('Redis')
        if (target.connector && target.connector.options) {
            recorder.recordEndPoint(addressStringOf(target.connector.options.host, target.connector.options.port))
        }

        const command = args[0]
        command[endTraceSymbol] = function() {}
        InstrumentArrowFunction.make(command, endTraceSymbol, this.traceContext).addChildTraceInterceptor(recorder)
        command.promise.finally(command[endTraceSymbol])
    }

    doInAfterTrace(recorder, thisArg, args) {
        let builder
        if (args?.length > 0 && typeof args[0].name === 'string') {
            const command = args[0].name
            builder = new MethodDescriptorBuilder(command).setClassName('Redis')
        } else {
            builder = new MethodDescriptorBuilder('command').setClassName('Redis')
        }
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
        recorder.recordApi(methodDescriptor)
        recorder.recordServiceType(serviceType)
    }
}

module.exports = IoredisSendCommandInterceptor