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
const MySQLDatabaseInformationContext = require('./mysql-database-information-context')

class MySQLCreateConnectionInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('createConnection')
                                        .setParameterVariableNames('connectionUri')
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(serviceType)
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            returned[databaseInfoSymbol] = MySQLDatabaseInformationContext.recordAndReturnDatabaseInfo(recorder, target, args)
            InstrumentMethod.make(returned, 'connect').addScopedInterceptor(new MySQLConnectionInterceptor())
            InstrumentMethod.make(returned, 'query').addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('Connection'))
        }
    }
}

module.exports = MySQLCreateConnectionInterceptor