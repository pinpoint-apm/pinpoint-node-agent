/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const InstrumentMethod = require('../../instrument-method')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')

class MySQLGetConnectionInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('getConnection')
            .setClassName('Pool')
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target) {
        if (target[databaseInfoSymbol]) {
            const databaseInfo = target[databaseInfoSymbol]
            recorder.recordEndPoint(databaseInfo.host)
            recorder.recordDestinationId(databaseInfo.database)
        }
    }

    prepareBeforeAsyncTrace(target, args) {
        if (args.length > 1 && args[1]) {
            const connection = args[1]
            InstrumentMethod.make(connection, 'query', this.traceContext).addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('PoolConnection'))
        }
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