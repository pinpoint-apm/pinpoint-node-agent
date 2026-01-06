/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const InstrumentMethod = require('../../instrument-method')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')
const apiMetaService = require('../../../context/api-meta-service')
const mysqlServiceType = require('./mysql-service-type')

class MySQLClusterOfInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(mysqlServiceType)
    }

    prepareAfterTrace(target, args, poolNamespace) {
        if (!poolNamespace) {
            return
        }
        InstrumentMethod.make(poolNamespace, 'getConnection', this.traceContext).addScopedInterceptor(new MySQLGetConnectionInterceptor(this.traceContext))
    }

    doInAfterTrace(recorder) {
        const methodDescriptorBuilder = new MethodDescriptorBuilder('of')
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
        recorder.recordApi(methodDescriptor)
    }
}

module.exports = MySQLClusterOfInterceptor