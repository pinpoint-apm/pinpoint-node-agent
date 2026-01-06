/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./redis-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const { addressStringOf } = require('../../../utils/convert-utils')
const InstrumentArrowFunction = require('../../instrument-arrow-function')
const apiMetaService = require('../../../context/api-meta-service')

class RedisInternalSendCommandInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
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
        InstrumentArrowFunction.make(command, 'callback', this.traceContext).addChildTraceInterceptor(recorder)
    }

    doInAfterTrace(recorder, thisArg, args) {
        let builder
        if (args?.length > 0 && typeof args[0].command === 'string') {
            const command = args[0].command
            builder = new MethodDescriptorBuilder(command).setClassName('RedisClient')
        } else {
            builder = new MethodDescriptorBuilder('command').setClassName('RedisClient')
        }
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(builder)
        recorder.recordApi(methodDescriptor)
        recorder.recordServiceType(serviceType)
    }
}

module.exports = RedisInternalSendCommandInterceptor