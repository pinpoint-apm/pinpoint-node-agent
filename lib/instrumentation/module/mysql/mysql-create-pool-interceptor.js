/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const InstrumentMethod = require('../../instrument-method')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')
const MySQLRecorder = require('./mysql-recorder')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')

class MySQLCreatePoolInterceptor {
    constructor(traceContext) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('createPool')
        this.traceContext = traceContext
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(serviceType)
    }

    prepareAfterTrace(target, args, pool) {
        if (pool) {
            pool[databaseInfoSymbol] = args[0]
            InstrumentMethod.make(pool, 'getConnection', this.traceContext).addScopedInterceptor(new MySQLGetConnectionInterceptor(this.traceContext))
            InstrumentMethod.make(pool, 'query', this.traceContext).addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('PoolConnection'))
        }
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            MySQLRecorder.recordDatabaseInfo(recorder, returned[databaseInfoSymbol])
        }
    }
}

module.exports = MySQLCreatePoolInterceptor