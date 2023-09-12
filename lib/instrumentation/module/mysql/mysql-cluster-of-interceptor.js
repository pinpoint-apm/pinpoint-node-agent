/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const MethodDescriptorBuilder2 = require('../../../context/method-descriptor-builder2')
const InstrumentMethod = require('../../instrument-method')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')

class MySQLClusterOfInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = new MethodDescriptorBuilder2('of')
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(require('./mysql-service-type'))
    }

    prepareAfterTrace(target, args, poolNamespace) {
        if (!poolNamespace) {
            return
        }
        InstrumentMethod.make(poolNamespace, 'getConnection', this.traceContext).addScopedInterceptor(new MySQLGetConnectionInterceptor(this.traceContext))
    }
}

module.exports = MySQLClusterOfInterceptor