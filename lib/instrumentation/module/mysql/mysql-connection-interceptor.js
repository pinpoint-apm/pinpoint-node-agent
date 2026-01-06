/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const apiMetaService = require('../../../context/api-meta-service')

class MySQLConnectionConnectInterceptor {
    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(serviceType)
    }

    doInBeforeAsyncTrace(asyncEventRecorder, target, args) {
        asyncEventRecorder.recordServiceType(serviceType)
    }

    callbackIndexOf(args) {
        if (args.length > 1 && typeof args[1] === 'function') {
            return 1
        }

        if (typeof args[0] !== 'function') {
            return
        }

        return 0
    }

    doInAfterTrace(recorder) {
        const methodDescriptorBuilder = new MethodDescriptorBuilder('connect')
            .setClassName('Connection')
            .setParameterVariableNames('connectionUri')
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
        recorder.recordApi(methodDescriptor)
    }
}

module.exports = MySQLConnectionConnectInterceptor