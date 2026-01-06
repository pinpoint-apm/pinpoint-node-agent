/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const InstrumentMethod = require('../../instrument-method')
const MySQLConnectionInterceptor = require('./mysql-connection-interceptor')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLRecorder = require('./mysql-recorder')
const apiMetaService = require('../../../context/api-meta-service')

class MySQLCreateConnectionInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(serviceType)
    }

    prepareAfterTrace(target, args, connection) {
        if (connection) {
            connection[databaseInfoSymbol] = args[0]
            InstrumentMethod.make(connection, 'connect', this.traceContext).addScopedInterceptor(new MySQLConnectionInterceptor())
            InstrumentMethod.make(connection, 'query', this.traceContext).addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('Connection'))
        }
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            MySQLRecorder.recordDatabaseInfo(recorder, returned[databaseInfoSymbol])
        }
        const methodDescriptorBuilder = new MethodDescriptorBuilder('createConnection')
                                        .setParameterVariableNames('connectionUri')
        const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)
        recorder.recordApi(methodDescriptor)
    }
}

module.exports = MySQLCreateConnectionInterceptor