/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const InstrumentMethod = require('../../instrument-method')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')
const MySQLDatabaseInformationContext = require('./mysql-database-information-context')

class MySQLCreatePoolInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('createPool')
    }

    doInBeforeTrace(recorder) {
        recorder.recordServiceType(serviceType)
    }

    prepareAfterTrace(target, args, pool) {
        if (pool) {
            InstrumentMethod.make(pool, 'getConnection').addScopedInterceptor(new MySQLGetConnectionInterceptor())
        }
    }

    doInAfterTrace(recorder, target, args, returned) {
        if (returned) {
            returned[databaseInfoSymbol] = MySQLDatabaseInformationContext.recordAndReturnDatabaseInfo(recorder, target, args)
        }
    }
}

module.exports = MySQLCreatePoolInterceptor