/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const InstrumentMethod = require('../../instrument-method')
const MethodDescriptorBuilder2 = require("../../../context/method-descriptor-builder2")
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')
const MySQLDatabaseInformationContext = require('./mysql-database-information-context')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')

class MySQLCreatePoolInterceptor {
    constructor(traceContext) {
        this.traceContext = traceContext
        this.methodDescriptorBuilder = new MethodDescriptorBuilder2('createPool')
    }

    doInBeforeTrace(recorder, target, args) {
        recorder.recordServiceType(serviceType)
    }

    prepareAfterTrace(target, args, pool) {
        if (pool) {
            InstrumentMethod.make(pool, 'getConnection', this.traceContext).addScopedInterceptor(new MySQLGetConnectionInterceptor(this.traceContext))
        }
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            returned[databaseInfoSymbol] = MySQLDatabaseInformationContext.recordAndReturnDatabaseInfo(recorder, target, args)
        }
    }
}

module.exports = MySQLCreatePoolInterceptor