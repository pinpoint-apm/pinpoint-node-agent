/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./pg-service-type')
const InstrumentMethod = require('../../instrument-method')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./pg-database-information-symbol')
const PostgreSQLStatementExecuteQueryInterceptor = require('./pg-statement-execute-query-interceptor')
const PostgreSQLPoolConnectInterceptor = require('./pg-pool-connect-interceptor')
const PostgreSQLRecorder = require('./pg-recorder')

class PostgreSQLCreatePoolInterceptor {
    constructor(traceContext) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('Pool')
        this.methodDescriptorBuilder.setClassName('Pool')
        this.traceContext = traceContext
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(serviceType)
    }

    prepareAfterTrace(target, args, pool) {
        if (!pool) {
            return
        }
        pool[databaseInfoSymbol] = args[0]
        InstrumentMethod.make(pool, 'connect', this.traceContext).addScopedInterceptor(new PostgreSQLPoolConnectInterceptor(this.traceContext))
        InstrumentMethod.make(pool, 'query', this.traceContext).addScopedInterceptor(new PostgreSQLStatementExecuteQueryInterceptor('Pool'))
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            PostgreSQLRecorder.recordDatabaseInfo(recorder, returned[databaseInfoSymbol])
        }
    }
}

module.exports = PostgreSQLCreatePoolInterceptor 