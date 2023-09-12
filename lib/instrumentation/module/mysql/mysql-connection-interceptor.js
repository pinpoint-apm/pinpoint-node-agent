/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder2 = require('../../../context/method-descriptor-builder2')
class MySQLConnectionConnectInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder2('connect')
        this.methodDescriptorBuilder.setClassName('Connection')
        this.methodDescriptorBuilder.setParameterVariableNames('connectionUri')
    }

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
}

module.exports = MySQLConnectionConnectInterceptor