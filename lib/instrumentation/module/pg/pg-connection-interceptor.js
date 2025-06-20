/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./pg-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')

class PostgreSQLConnectionInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('connect')
        this.methodDescriptorBuilder.setClassName('Client')
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(serviceType)
    }

    doInBeforeAsyncTrace(asyncEventRecorder, target, args) {
        asyncEventRecorder.recordServiceType(serviceType)
    }

    callbackIndexOf(args) {
        // PostgreSQL connect method callback is typically the first argument
        if (args.length > 0 && typeof args[0] === 'function') {
            return 0
        }
        return -1
    }
}

module.exports = PostgreSQLConnectionInterceptor