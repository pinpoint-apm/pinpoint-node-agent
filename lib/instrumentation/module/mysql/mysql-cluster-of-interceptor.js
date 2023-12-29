/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentMethod = require('../../instrument-method')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')

class MySQLClusterOfInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('of')
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(require('./mysql-service-type'))
    }

    prepareAfterTrace(target, args, poolNamespace) {
        if (!poolNamespace) {
            return
        }
        InstrumentMethod.make(poolNamespace, 'getConnection').addScopedInterceptor(new MySQLGetConnectionInterceptor())
    }
}

module.exports = MySQLClusterOfInterceptor