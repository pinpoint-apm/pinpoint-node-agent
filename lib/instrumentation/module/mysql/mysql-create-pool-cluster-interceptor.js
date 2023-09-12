/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder2 = require('../../../context/method-descriptor-builder2')
const InstrumentMethod = require('../../instrument-method')
const MySQLClusterOfInterceptor = require('./mysql-cluster-of-interceptor')

class MySQLCreatePoolClusterInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = new MethodDescriptorBuilder2('createPoolCluster')
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(require('./mysql-service-type'))
    }

    prepareAfterTrace(target, args, poolCluster) {
        if (!poolCluster) {
            return
        }
        InstrumentMethod.make(poolCluster, 'of', this.traceContext).addScopedInterceptor(new MySQLClusterOfInterceptor(this.traceContext))
    }
}

module.exports = MySQLCreatePoolClusterInterceptor