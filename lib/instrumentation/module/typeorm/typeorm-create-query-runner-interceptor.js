/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./typeorm-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const TypeORMRecorder = require('./typeorm-recorder')

class TypeORMCreateQueryRunnerInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('createQueryRunner')
        this.methodDescriptorBuilder.setClassName('DataSource')
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(this.serviceType)
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (target && target.options) {
            const databaseInfo = {
                type: target.options.type,
                host: target.options.host,
                port: target.options.port,
                database: target.options.database,
                username: target.options.username
            }
            TypeORMRecorder.recordDatabaseInfo(recorder, databaseInfo)
        }
    }
}

module.exports = TypeORMCreateQueryRunnerInterceptor 