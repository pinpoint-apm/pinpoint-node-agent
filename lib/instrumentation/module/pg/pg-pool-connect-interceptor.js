/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./pg-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./pg-database-information-symbol')
const InstrumentMethod = require('../../instrument-method')
const PostgreSQLStatementExecuteQueryInterceptor = require('./pg-statement-execute-query-interceptor')
const PostgreSQLRecorder = require('./pg-recorder')

class PostgreSQLPoolConnectInterceptor {
    constructor(traceContext) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('connect')
            .setClassName('Pool')
        this.serviceType = serviceType
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder, target) {
        PostgreSQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])
    }

    prepareBeforeAsyncTrace(target, args) {
        if (args.length > 1 && args[1]) {
            const client = args[1]
            InstrumentMethod.make(client, 'query', this.traceContext).addScopedInterceptor(new PostgreSQLStatementExecuteQueryInterceptor('PoolClient'))
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

module.exports = PostgreSQLPoolConnectInterceptor 