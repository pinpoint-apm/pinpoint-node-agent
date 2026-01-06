/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const InstrumentMethod = require('../../instrument-method')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')
const MySQLRecorder = require('./mysql-recorder')
const apiMetaService = require('../../../context/api-meta-service')

class MySQLGetConnectionInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder, target) {
        MySQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])
    }

    prepareBeforeAsyncTrace(target, args) {
        if (args.length > 1 && args[1]) {
            const connection = args[1]
            InstrumentMethod.make(connection, 'query', this.traceContext).addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('PoolConnection'))
        }
    }

    doInAfterTrace(recorder) {
        const methodDescriptorBuilder = new MethodDescriptorBuilder('getConnection')
            .setClassName('Pool')
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
        recorder.recordApi(methodDescriptor)
        recorder.recordServiceType(serviceType)
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

module.exports = MySQLGetConnectionInterceptor