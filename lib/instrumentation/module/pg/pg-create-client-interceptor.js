/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./pg-service-type')
const InstrumentMethod = require('../../instrument-method')
const PostgreSQLConnectionInterceptor = require('./pg-connection-interceptor')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const PostgreSQLStatementExecuteQueryInterceptor = require('./pg-statement-execute-query-interceptor')
const databaseInfoSymbol = require('./pg-database-information-symbol')
const PostgreSQLRecorder = require('./pg-recorder')

class PostgreSQLCreateClientInterceptor {
    constructor(traceContext) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('Client')
        this.methodDescriptorBuilder.setClassName('Client')
        this.traceContext = traceContext
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(this.serviceType)
    }

    prepareAfterTrace(target, args, client) {
        if (client) {
            client[databaseInfoSymbol] = args[0]
            InstrumentMethod.make(client, 'connect', this.traceContext).addScopedInterceptor(new PostgreSQLConnectionInterceptor())
            InstrumentMethod.make(client, 'query', this.traceContext).addScopedInterceptor(new PostgreSQLStatementExecuteQueryInterceptor('Client'))
        }
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            PostgreSQLRecorder.recordDatabaseInfo(recorder, returned[databaseInfoSymbol])
        }
    }
}

module.exports = PostgreSQLCreateClientInterceptor 