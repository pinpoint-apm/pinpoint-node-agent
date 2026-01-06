/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentMethod = require('../../instrument-method')
const MySQLClusterOfInterceptor = require('./mysql-cluster-of-interceptor')
const apiMetaService = require('../../../context/api-meta-service')

class MySQLCreatePoolClusterInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
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

    doInAfterTrace(recorder) {
        const methodDescriptorBuilder = new MethodDescriptorBuilder('createPoolCluster')
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
        recorder.recordApi(methodDescriptor)
    }
}

module.exports = MySQLCreatePoolClusterInterceptor