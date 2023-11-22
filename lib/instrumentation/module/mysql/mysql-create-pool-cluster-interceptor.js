/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentMethod = require('../../instrument-method')
const MySQLClusterOfInterceptor = require('./mysql-cluster-of-interceptor')

class MySQLCreatePoolClusterInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('createPoolCluster')
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(require('./mysql-service-type'))
    }

    prepareAfterTrace(target, args, poolCluster) {
        if (!poolCluster) {
            return
        }
        InstrumentMethod.make(poolCluster, 'of').addScopedInterceptor(new MySQLClusterOfInterceptor())
    }
}

module.exports = MySQLCreatePoolClusterInterceptor